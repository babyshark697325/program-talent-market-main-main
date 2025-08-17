import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";

/** Strict role union kept in code so TS matches DB constraint */
type Role = "student" | "client" | "admin";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: Role | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

type Props = { children: ReactNode };

function normalizeRole(value: any): Role {
  return value === "student" || value === "client" || value === "admin" ? value : "client";
}

/** ---------- Helpers that touch the DB ---------- **/

/** Ensure a row exists in public.profiles with case-insensitive unique email */
async function ensureProfile(u: User) {
  try {
    const email = (u.email || "").trim().toLowerCase();
    // prefer display_name from metadata; fallback to first_name, then email local-part
    const md: any = u.user_metadata || {};
    const displayName: string =
      (md.display_name as string) ||
      (md.first_name as string) ||
      (email ? email.split("@")[0] : "User");

    await supabase
      .from("profiles")
      // no generics to avoid versioned type conflicts; onConflict by user_id (PK)
      .upsert([{ user_id: u.id, email, display_name: displayName }] as any, {
        onConflict: "user_id",
      });
  } catch (e) {
    console.warn("[Auth] ensureProfile error:", e);
  }
}

/** Read role from user_roles as strict Role */
async function fetchUserRole(userId: string): Promise<Role | null> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.warn("[Auth] fetchUserRole error:", error);
      return null;
    }
    return data?.role ? normalizeRole(data.role) : null;
  } catch (e) {
    console.warn("[Auth] fetchUserRole exception:", e);
    return null;
  }
}

/** Ensure a row exists in user_roles with a strict Role (defaults if metadata missing) */
async function ensureUserRoleRow(u: User) {
  try {
    const { data: existing } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .eq("user_id", u.id)
      .maybeSingle();

    const md: any = u.user_metadata || {};
    const desiredRole: Role = normalizeRole(md.role);

    if (!existing) {
      // No row yet → create with desired role (metadata or default client)
      await supabase
        .from("user_roles")
        .upsert([{ user_id: u.id, role: desiredRole }] as any, { onConflict: "user_id" });
      return;
    }

    // Row exists: if role is null/invalid, repair it to desiredRole
    const r: any = existing.role;
    const valid = r === "student" || r === "client" || r === "admin";
    if (!valid) {
      await supabase.from("user_roles").update({ role: desiredRole } as any).eq("user_id", u.id);
    }
  } catch (e) {
    console.warn("[Auth] ensureUserRoleRow error:", e);
  }
}

/** ------------------------------------------------ **/

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const loadSessionAndRole = async (s: Session | null) => {
    try {
      setSession(s);
      const u = s?.user ?? null;
      setUser(u);

      if (u) {
        // Ensure guest mode is cleared when a real session exists
        setIsGuest(false);

        // Set a preliminary role from metadata immediately for fast UI routing
        const md: any = u.user_metadata || {};
        const prelimRole: Role = normalizeRole(md.role);
        setUserRole(prelimRole);

        // Run profile sync + role ensure + DB fetch in background without blocking UI
        ;(async () => {
          try {
            await Promise.all([ensureProfile(u), ensureUserRoleRow(u)]);
            const dbRole = await fetchUserRole(u.id);
            let finalRole: Role = dbRole ?? prelimRole;
            // If DB role missing, try to persist prelim role
            if (!dbRole) {
              try {
                await supabase
                  .from("user_roles")
                  .upsert([{ user_id: u.id, role: prelimRole }] as any, { onConflict: "user_id" });
              } catch (e) {
                console.warn("[Auth] upsert fallback role error:", e);
              }
            }
            setUserRole(finalRole);
          } catch (e) {
            console.warn("[Auth] background role/profile sync error:", e);
          }
        })();
      } else {
        setUserRole(null);
      }
    } catch (e) {
      console.error("[Auth] loadSessionAndRole exception:", e);
      setUserRole(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          await loadSessionAndRole(data.session ?? null);
        }
      } catch (e) {
        console.error("[Auth] getSession error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        try {
          // Do not block UI on background sync
          loadSessionAndRole(newSession ?? null);
        } catch (e) {
          console.error("[Auth] onAuthStateChange error:", e);
        } finally {
          setLoading(false);
        }
      }
    );

    init();

    return () => {
      cancelled = true;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  /** ------------- Public methods ------------- **/

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => {
    const redirectUrl = `${window.location.origin}/auth`;
    const normalizedEmail = email.trim().toLowerCase();
    const desiredRole: Role = normalizeRole(role);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          display_name: firstName || normalizedEmail.split("@")[0],
          role: desiredRole,
        },
      },
    });

    // If Supabase returned a user immediately (e.g., email confirm disabled in dev),
    // eagerly sync profiles + roles so UI is coherent on first render.
    const newUser = data?.user;
    if (newUser) {
      await Promise.all([ensureProfile(newUser), ensureUserRoleRow(newUser)]);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    return { error };
  };

  // Bullet-proof logout: clear tokens/state and hard-redirect
  const signOut = async () => {
    console.log("[Auth] signOut start");
    supabase.auth.signOut().catch((e) => console.error("[Auth] supabase signOut error", e));

    setUser(null);
    setSession(null);
    setUserRole(null);
    setIsGuest(false);

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i)!;
        if (k.startsWith("sb-")) localStorage.removeItem(k);
      }
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i)!;
        if (k.startsWith("sb-")) sessionStorage.removeItem(k);
      }
    } catch {
      /* ignore */
    }

    window.location.href = "/auth";
  };

  const continueAsGuest = () => {
    // Clear any stale Supabase auth tokens that could trigger 400 refresh calls
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i)!;
        if (k.startsWith("sb-")) localStorage.removeItem(k);
      }
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i)!;
        if (k.startsWith("sb-")) sessionStorage.removeItem(k);
      }
    } catch {
      /* ignore */
    }

    setIsGuest(true);
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    session,
    userRole,
    loading,
    isGuest,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


