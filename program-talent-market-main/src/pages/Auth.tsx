import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

/** Role type used locally to keep TS strict while we coerce values */
type Role = "student" | "client" | "admin";
const normalizeRole = (v: any): Role =>
  v === "student" || v === "client" || v === "admin" ? v : "client";

const getPathForRole = (role?: Role | null) =>
  role === "admin" ? "/admin-dashboard" :
  role === "student" ? "/student-dashboard" : "/client-dashboard";

const Auth: React.FC = () => {
  const { signIn, signUp, user, userRole, continueAsGuest, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [tab, setTab] = React.useState<"signin" | "signup">("signin");
  const [signInData, setSignInData] = React.useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student",
  });
  const [submitting, setSubmitting] = React.useState<"in" | "up" | "reset" | "resend" | null>(null);

  React.useEffect(() => {
    if (!loading && user) {
      navigate(getPathForRole(userRole), { replace: true });
    }
  }, [loading, user, userRole, navigate]);

  // If redirected from a restricted guest action, switch to signup tab
  React.useEffect(() => {
    const st = location.state as any;
    if (st?.signup) {
      setTab("signup");
    }
  }, [location.state]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting("in");

    const email = signInData.email.trim().toLowerCase();
    const password = signInData.password;

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message || "Please check your email and password.",
          variant: "destructive",
        });
        return;
      }
      // Do not navigate immediately; let onAuthStateChange update context and
      // the effect below will navigate once user/session are ready.
    } finally {
      setSubmitting(null);
    }
  };

  const resendConfirmation = async (email: string) => {
    setSubmitting("resend");
    try {
      // Supabase resend for signup confirmations
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) {
        toast({ title: "Couldn’t resend confirmation", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Confirmation sent", description: "Check your inbox for the confirmation link." });
      }
    } catch (e: any) {
      toast({ title: "Couldn’t resend confirmation", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSubmitting(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting("up");

    const email = signUpData.email.trim().toLowerCase(); // normalize
    const { password, firstName, lastName, role } = signUpData;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            first_name: firstName,
            last_name: lastName,
            display_name: firstName || email.split("@")[0],
            role: normalizeRole(role),
          },
        },
      });

      // --- Detect "already registered" (Supabase quirk) ---
      const identitiesLen = (data?.user as any)?.identities?.length ?? undefined;
      const msg = (error?.message || "").toLowerCase();
      const alreadyRegistered =
        error?.status === 422 ||
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        msg.includes("duplicate") ||
        identitiesLen === 0; // empty identities => existing user

      if (alreadyRegistered) {
        toast({
          title: "Email already registered",
          description: "Try signing in instead, or reset your password.",
          variant: "destructive",
        });
        setTab("signin");
        return;
      }

      if (error) {
        toast({
          title: "Couldn’t create account",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Real new signup
      toast({
        title: "Check your email",
        description: "We sent a confirmation link to complete sign up.",
      });
      setTab("signin");

      // Optional helper: quick resend button
      setTimeout(() => {
        toast({
          title: "Didn’t get it?",
          description: "You can resend the confirmation email.",
          action: (
            <Button
              variant="outline"
              onClick={() => resendConfirmation(email)}
              disabled={submitting === "resend"}
            >
              Resend
            </Button>
          ),
        });
      }, 600);
    } finally {
      setSubmitting(null);
    }
  };

  const handleResetPassword = async () => {
    const email = signInData.email.trim().toLowerCase();
    if (!email) {
      toast({
        title: "Enter your email first",
        description: "Type your email above, then click 'Forgot password?'",
      });
      return;
    }
    setSubmitting("reset");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent a password reset link." });
      }
    } finally {
      setSubmitting(null);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen w-full grid place-items-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to MyVillage</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in or create an account to continue</p>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In */}
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-in">Email</Label>
                  <Input
                    id="email-in"
                    type="email"
                    placeholder="you@example.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-in">Password</Label>
                  <Input
                    id="password-in"
                    type="password"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting === "in"}>
                  {submitting === "in" ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  className="mt-2 text-xs text-muted-foreground underline"
                  onClick={handleResetPassword}
                  disabled={submitting === "reset"}
                >
                  {submitting === "reset" ? "Sending reset link..." : "Forgot password?"}
                </button>
              </form>
            </TabsContent>

            {/* Sign Up */}
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first">First name</Label>
                    <Input
                      id="first"
                      placeholder="First name"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last">Last name</Label>
                    <Input
                      id="last"
                      placeholder="Last name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-up">Email</Label>
                  <Input
                    id="email-up"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-up">Password</Label>
                  <Input
                    id="password-up"
                    type="password"
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={signUpData.role}
                    onValueChange={(v) => setSignUpData({ ...signUpData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={submitting === "up"}>
                  {submitting === "up" ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleGuest}>
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

