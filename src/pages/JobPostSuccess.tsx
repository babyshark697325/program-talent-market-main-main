import React from "react";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Edit, Share, ShoppingBag, Lightbulb } from "lucide-react";

const JobPostSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const title = params.get("title") || "Build E-Commerce Website";
  const budget = params.get("budget") || "300";
  const duration = params.get("duration") || "2-3 Weeks";

  const actionCards = [
    {
      icon: Users,
      title: "Manage Applications",
      description: "View and manage the candidates who apply to your job",
      onClick: () => navigate("/manage-applications")
    },
    {
      icon: Edit,
      title: "Edit Job Posting",
      description: "Make changes to the job details, budget, or duration",
      onClick: () => navigate("/edit-job")
    },
    {
      icon: Share,
      title: "Share Job",
      description: "Copy the job listing link to share it with others",
      onClick: () => {
        // Share functionality
        const shareUrl = `${window.location.origin}/jobs/latest`;
        navigator.clipboard.writeText(shareUrl);
      }
    },
    {
      icon: ShoppingBag,
      title: "Post Another Job",
      description: "Create a new job listing to hire for another role.",
      onClick: () => navigate("/post-job")
    }
  ];

  const tips = [
    "Promote your job by sharing it directly with students.",
    "Check applications daily to hire faster",
    "You can edit your posting at any time"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden bg-card">
            {/* Success Header */}
            <div className="bg-primary/10 p-6 flex items-center justify-center gap-4 border-b border-border">
              <div className="p-2 bg-primary/20 rounded-full">
                <CheckCircle className="text-primary" size={28} />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Job Successfully Posted</h1>
                <p className="text-muted-foreground">Thanks for posting to MyVillage Talent</p>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Job Title */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
                
                {/* Budget and Duration - Compact side by side */}
                <div className="flex gap-4 justify-center max-w-sm mx-auto">
                  <div className="flex-1 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide block mb-1">Budget</span>
                    <div className="text-lg font-bold text-primary">${budget}</div>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-4 border border-accent/20">
                    <span className="text-xs font-medium text-accent-foreground uppercase tracking-wide block mb-1">Duration</span>
                    <div className="text-lg font-bold text-accent-foreground">{duration}</div>
                  </div>
                </div>
              </div>

              {/* Action Cards Grid - More compact */}
              <div className="grid grid-cols-2 gap-4">
                {actionCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <div 
                      key={index} 
                      className="group bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg p-4 border border-muted-foreground/10 hover:border-primary/30 hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer hover:shadow-md"
                      onClick={card.onClick}
                    >
                      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors text-sm">{card.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tips Section - Streamlined */}
              <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Tips for Success</h3>
                </div>
                <div className="space-y-2">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobPostSuccess;
