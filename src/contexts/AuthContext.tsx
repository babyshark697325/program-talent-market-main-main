/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { isDeveloperEmail } from "../config/developer";

/** Strict role union kept in code so TS matches DB constraint */
// App-visible role union; DB remains student|client|admin. Developer maps to admin privileges.
type Role = "student" | "client" | "admin" | "developer";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: Role | null;
  loading: boolean;
  isGuest: boolean;
  isDeveloper: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
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

// Normalize role values coming from metadata/DB to a DB-safe role
// Note: 'developer' maps to 'admin' for persistence but may be shown at runtime.
function normalizeRole(value: unknown): Exclude<Role, "developer"> {
  return value === "student" || value === "client" || value === "admin" ? value : "client";
}

/** ---------- Helpers that touch the DB ---------- **/

/** Ensure a row exists in public.profiles with case-insensitive unique email */
async function ensureProfile(u: User) {
  try {
    const email = (u.email || "").trim().toLowerCase();
    // prefer display_name from metadata; fallback to first_name, then email local-part
    const md: Record<string, unknown> = u.user_metadata || {};
    const first = (md.first_name as string | undefined)?.toString().trim() || "";
    const last = (md.last_name as string | undefined)?.toString().trim() || "";
    const fullName = [first, last].filter(Boolean).join(" ").trim();
    const displayName: string =
      fullName ||
      (md.display_name as string) ||
      first ||
      (email ? email.split("@")[0] : "User");

    await supabase
      .from("profiles")
      // no generics to avoid versioned type conflicts; onConflict by user_id (PK)
      .upsert([{ user_id: u.id, email, display_name: displayName }], {
        onConflict: "user_id",
      });
  } catch (e) {
    console.warn("[Auth] ensureProfile error:", e);
  }
}

/** Read role from user_roles as strict Role */
async function fetchUserRole(userId: string): Promise<Exclude<Role, "developer"> | null> {
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

    const md: Record<string, unknown> = u.user_metadata || {};
    const desiredRole = normalizeRole(md.role);

    if (!existing) {
      // No row yet → create with desired role (metadata or default client)
      await supabase
        .from("user_roles")
        .upsert([{ user_id: u.id, role: desiredRole }], { onConflict: "user_id" });
      return;
    }

    // Row exists: if role is null/invalid, repair it to desiredRole
    const r: unknown = existing.role;
    const valid = r === "student" || r === "client" || r === "admin";
    if (!valid) {
      await supabase.from("user_roles").update({ role: desiredRole }).eq("user_id", u.id);
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
  const [isDeveloper, setIsDeveloper] = useState(false);

  const loadSessionAndRole = async (s: Session | null) => {
    try {
      setSession(s);
      const u = s?.user ?? null;
      setUser(u);

      if (u) {
        // Ensure guest mode is cleared when a real session exists
        setIsGuest(false);

        // Mark developer accounts by email
        const email = (u.email || '').trim().toLowerCase();
        const dev = isDeveloperEmail(email);
        setIsDeveloper(dev);

        // Set a preliminary role from metadata immediately for fast UI routing
        const md: Record<string, unknown> = u.user_metadata || {};
        const prelimRole: Role = normalizeRole(md.role);
        // Surface 'developer' role label at runtime if this account is marked developer
        setUserRole(dev ? 'developer' : prelimRole);

        // Run profile sync + role ensure + DB fetch in background without blocking UI
        ; (async () => {
          try {
            await Promise.all([ensureProfile(u), ensureUserRoleRow(u)]);
            const dbRole = await fetchUserRole(u.id);
            let finalRole: Role = (dbRole ?? prelimRole);
            // Elevate developer accounts to developer label at runtime (admin privileges)
            if (dev) finalRole = 'developer';
            // If DB role missing, try to persist prelim role
            if (!dbRole) {
              try {
                await supabase
                  .from("user_roles")
                  .upsert([{ user_id: u.id, role: prelimRole }], { onConflict: "user_id" });
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
        setIsDeveloper(false);
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
    const desiredRole = normalizeRole(role);

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

    // Handle demo login specially
    if (normalized === 'demo@talent.com' && password === 'demo123') {
      // Create a mock user object for demo
      const mockUser = {
        id: 'demo-user-id',
        email: 'demo@talent.com',
        user_metadata: {
          firstName: 'Demo',
          lastName: 'User',
          role: 'developer'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString()
      } as User;

      const mockSession = {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      // Set the mock user and session
      setUser(mockUser);
      setSession(mockSession);
      setUserRole('developer');
      setIsGuest(false);

      return { error: null };
    }

    // Regular Supabase authentication for other users
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
    isDeveloper,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
