import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Auth: React.FC = () => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [signInData, setSignInData] = React.useState({ 
    email: "", 
    password: "" 
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const email = signInData.email.trim().toLowerCase();
    const password = signInData.password;

    try {
      // TODO: Replace with real authentication logic
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Welcome to MyVillage</h2>
      <form onSubmit={handleSignIn} className="space-y-4 w-full max-w-md">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={signInData.email}
            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
        <Separator className="my-6" />
        <Button variant="outline" className="w-full" onClick={handleGuest}>
          Continue as Guest
        </Button>
      </form>
    </div>
  );
};

export default Auth;
