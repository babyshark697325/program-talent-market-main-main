import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Waitlist: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [waitlistData, setWaitlistData] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "student",
    city: "",
    passcode: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [showPasscode, setShowPasscode] = React.useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validation logic (same as Auth.tsx)
      const missingFields = [];
      
      if (!waitlistData.firstName.trim()) missingFields.push("First name");
      if (!waitlistData.lastName.trim()) missingFields.push("Last name");
      if (!waitlistData.email.trim()) missingFields.push("Email");
      if (!waitlistData.role) missingFields.push("Role");
      if (!waitlistData.city.trim()) missingFields.push("City");
      if (waitlistData.role && !waitlistData.passcode.trim()) missingFields.push("Passcode");

      if (missingFields.length > 0) {
        toast({
          title: "Missing required information",
          description: `Please fill in: ${missingFields.join(", ")}.`,
          variant: "destructive",
        });
        return;
      }

      const rolePasscodes = {
        student: "STU-2025",
        client: "CLI-2025",
        admin: "ADM-2025"
      };

      if (waitlistData.role && waitlistData.passcode !== rolePasscodes[waitlistData.role as keyof typeof rolePasscodes]) {
        toast({
          title: "Invalid passcode",
          description: "Please enter the correct passcode for your selected role.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("waitlist")
        .insert({
          email: waitlistData.email,
          first_name: waitlistData.firstName,
          last_name: waitlistData.lastName,
          role: waitlistData.role,
          city: waitlistData.city,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already on waitlist",
            description: "This email is already registered for the waitlist.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Couldn't join waitlist",
            description: error.message || "Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Welcome to the waitlist!",
        description: "We'll notify you when we're ready to onboard new users.",
      });

      // Reset form
      setWaitlistData({
        email: "",
        firstName: "",
        lastName: "",
        role: "student",
        city: "",
        passcode: "",
      });

      // Optionally redirect to auth page
      setTimeout(() => navigate("/auth"), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid place-items-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join Our Waitlist</CardTitle>
          <p className="text-sm text-muted-foreground">
            Be the first to know when we're ready to onboard new users
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWaitlist} className="space-y-4">
            {/* Same form fields as Auth.tsx waitlist tab */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-waitlist">First name</Label>
                <Input
                  id="first-waitlist"
                  placeholder="First name"
                  value={waitlistData.firstName}
                  onChange={(e) => setWaitlistData({ ...waitlistData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-waitlist">Last name</Label>
                <Input
                  id="last-waitlist"
                  placeholder="Last name"
                  value={waitlistData.lastName}
                  onChange={(e) => setWaitlistData({ ...waitlistData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-waitlist">Email</Label>
              <Input
                id="email-waitlist"
                type="email"
                placeholder="you@example.com"
                value={waitlistData.email}
                onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={waitlistData.role}
                onValueChange={(v) => setWaitlistData({ ...waitlistData, role: v, passcode: "" })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {waitlistData.role && (
              <div className="space-y-2">
                <Label htmlFor="passcode-waitlist">Passcode</Label>
                <div className="relative">
                  <Input
                    id="passcode-waitlist"
                    type={showPasscode ? "text" : "password"}
                    placeholder="Enter passcode"
                    value={waitlistData.passcode}
                    onChange={(e) => setWaitlistData({ ...waitlistData, passcode: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasscode(!showPasscode)}
                  >
                    {showPasscode ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="city-waitlist">City</Label>
              <Input
                id="city-waitlist"
                placeholder="e.g., Jacksonville, Orlando, Tampa"
                value={waitlistData.city}
                onChange={(e) => setWaitlistData({ ...waitlistData, city: e.target.value })}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Joining waitlist..." : "Join Waitlist"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              We'll notify you when we're ready to onboard new users.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Waitlist;