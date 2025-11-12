import * as React from "react";
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
    email: "demo@talent.com", 
    password: "demo123" 
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const email = signInData.email.trim().toLowerCase();
    const password = signInData.password;

    try {
      // Demo login check
      if (email === "demo@talent.com" && password === "demo123") {
        toast({
          title: "Welcome to MyVillage!",
          description: "Demo login successful",
          variant: "default",
        });
        
        // Simulate login success and redirect
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        return;
      }

      // Invalid credentials
      toast({
        title: "Invalid credentials",
        description: "Please use the demo credentials: demo@talent.com / demo123",
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
    <div className="min-h-screen w-full grid place-items-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to MyVillage</CardTitle>
          <p className="text-sm text-muted-foreground">Demo Login</p>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Demo credentials helper */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-700 font-medium mb-2">🎬 Demo Credentials:</p>
            <p className="text-xs text-blue-600 mb-1">Email: <span className="font-mono font-semibold">demo@talent.com</span></p>
            <p className="text-xs text-blue-600">Password: <span className="font-mono font-semibold">demo123</span></p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@talent.com"
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
                  placeholder="demo123"
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
          </form>

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
