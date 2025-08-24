import * as React from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function getInitials(nameOrEmail: string) {
  const text = (nameOrEmail || "").trim();
  if (!text) return "U";
  const parts = text.split(/[\s.@_-]+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last || first).toUpperCase();
}

const UserMenu: React.FC = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button size="sm" variant="outline" onClick={() => navigate("/auth")}>
        Sign in
      </Button>
    );
  }

  const displayName =
    (user.user_metadata?.display_name as string) ||
    (user.user_metadata?.first_name as string) ||
    (user.email as string) ||
    "User";

  const normalizeRole = (v: unknown) =>
    v === "student" || v === "client" || v === "admin" ? v : "client";

  const metaRole = normalizeRole((user.user_metadata as Record<string, unknown>)?.role);
  const displayRole = userRole ?? metaRole ?? "client";

  const goProfile = (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    navigate("/profile");
  };

  const goSettings = (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    if (userRole === "admin") navigate("/admin/settings");
    else if (userRole === "client") navigate("/client/settings");
    else navigate("/profile");
  };

  const doLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    console.log("[UserMenu] Logout clicked");
    await signOut();
    console.log("[UserMenu] signOut resolved");
    // belt & suspenders: if still not on /auth, hard replace
    if (!/\/auth$/.test(window.location.pathname)) {
      window.location.replace("/auth");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0 rounded-full" aria-label="Open user menu">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="font-medium truncate">{displayName}</span>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          <div className="mt-1">
            <Badge variant="secondary" className="text-[10px] uppercase">
              {displayRole}
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={goProfile} onClick={goProfile}>Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={goSettings} onClick={goSettings}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onSelect={doLogout}
          onClick={doLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;


