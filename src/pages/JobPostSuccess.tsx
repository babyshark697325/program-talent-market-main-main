import React from "react";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home, Briefcase } from "lucide-react";

const JobPostSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const title = params.get("title") || "Your Job Posting";
  const budget = params.get("budget") || "Budget not specified";
  const duration = params.get("duration") || "Duration not specified";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/15 to-accent/15 p-6 flex items-center gap-3">
              <CheckCircle className="text-primary" size={28} />
              <div>
                <h1 className="text-2xl font-bold">Job successfully posted</h1>
                <p className="text-muted-foreground">Thanks for posting to MyVillage Talent</p>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>
                <span className="font-medium text-foreground">{budget}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{duration}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  Your job is now visible to students. You can manage applications, edit details, or remove the posting from your dashboard at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="w-full h-12 text-base"
                  onClick={() => navigate("/manage-jobs")}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Go to Manage Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={() => navigate("/")}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobPostSuccess;
