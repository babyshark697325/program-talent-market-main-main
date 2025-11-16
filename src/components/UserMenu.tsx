import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon } from "lucide-react";

function getInitials(nameOrEmail: string) {
  const text = (nameOrEmail || "").trim();
  if (!text) return "U";
  const parts = text.split(/[\s.@_-]+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last || first).toUpperCase();
}


const UserMenu: React.FC = () => {
  const { user, userRole, isDeveloper, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const navigate = useNavigate();

  // All hooks must be called unconditionally
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const uid = user?.id;
        if (!uid) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('user_id', uid)
          .maybeSingle();
        if (!cancelled) {
          if (!error && data?.avatar_url) setAvatarUrl(data.avatar_url);
          else setAvatarUrl(null);
        }
      } catch {
        if (!cancelled) setAvatarUrl(null);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  const goProfile = React.useCallback((event: Event) => {
    event.preventDefault();
    navigate("/profile");
  }, [navigate]);

  const goProfileClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    navigate("/profile");
  }, [navigate]);

  const goSettings = React.useCallback((event: Event) => {
    event.preventDefault();
    if (userRole === "admin") navigate("/admin/settings");
    else if (userRole === "client") navigate("/client/settings");
    else navigate("/profile");
  }, [navigate, userRole]);

  const goSettingsClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (userRole === "admin") navigate("/admin/settings");
    else if (userRole === "client") navigate("/client/settings");
    else navigate("/profile");
  }, [navigate, userRole]);

  const doLogout = React.useCallback(async (event: Event) => {
    event.preventDefault();
    console.log("[UserMenu] Logout clicked");
    await signOut();
    console.log("[UserMenu] signOut resolved");
    if (!/\/auth$/.test(window.location.pathname)) {
      window.location.replace("/auth");
    }
  }, [signOut]);

  const doLogoutClick = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("[UserMenu] Logout clicked");
    await signOut();
    console.log("[UserMenu] signOut resolved");
    if (!/\/auth$/.test(window.location.pathname)) {
      window.location.replace("/auth");
    }
  }, [signOut]);

  // All hooks above, now do conditional rendering
  if (!user) {
    return (
      <Button size="sm" variant="outline" onClick={() => navigate("/auth")}> 
        Sign in
      </Button>
    );
  }

  const md = (user.user_metadata as Record<string, unknown>) || {};
  const fullName = [md.first_name as string | undefined, md.last_name as string | undefined]
    .filter(Boolean)
    .join(" ");
  const displayName =
    (fullName && fullName.trim()) ||
    (md.display_name as string) ||
    (user.email as string) ||
    "User";

  const normalizeRole = (v: unknown) =>
    v === "student" || v === "client" || v === "admin" || v === "developer" ? v : "client";

  const metaRole = normalizeRole((user.user_metadata as Record<string, unknown>)?.role);
  const baseRole = metaRole || "client";
  // For developer accounts, show primary badge as "student" (your day-to-day role)
  const displayBaseRole = (userRole === 'developer' || isDeveloper) ? 'student' : baseRole;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="h-9 w-9 p-0 rounded-full border-0 outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent active:bg-transparent"
        >
          <Avatar className="h-9 w-9 outline-none ring-0 border-0">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 border-0 rounded-lg p-2 shadow-lg bg-popover/95 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <DropdownMenuLabel className="flex flex-col gap-1 pb-2">
            <span className="font-medium text-sm truncate">{displayName}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            <div className="mt-1.5 flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="uppercase tracking-wide text-[9px] leading-4 px-2.5 py-0.5 rounded-full"
            >
              {displayBaseRole}
            </Badge>
            {isDeveloper && (
              <Badge className="uppercase tracking-wide text-[9px] leading-4 px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Developer
              </Badge>
            )}
          </div>
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-border/50" />
  <DropdownMenuItem className="px-3 py-2 rounded-md leading-5 focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground" onSelect={goProfile} onClick={goProfileClick}>Profile</DropdownMenuItem>
  <DropdownMenuItem className="px-3 py-2 rounded-md leading-5 focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground" onSelect={goSettings} onClick={goSettingsClick}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator className="my-1.5 bg-border/50" />
        <DropdownMenuItem
          className="px-3 py-2 rounded-md leading-5 text-red-600 focus:text-red-600 hover:text-red-600 focus:bg-destructive/10 hover:bg-destructive/10"
          onSelect={doLogout}
          onClick={doLogoutClick}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
