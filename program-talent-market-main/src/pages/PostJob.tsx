import React from "react";
import { useNavigate } from "react-router-dom";
import PostJobForm from "@/components/PostJobForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePostJob = (formData: any) => {
    console.log("Job posted:", formData);
    toast({
      title: "Job Posted Successfully!",
      description: "Your job listing has been posted and is now live.",
    });
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </div>
          
          <Card className="rounded-3xl border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Post a New Job
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Fill out the form below to post a new job opportunity for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostJobForm 
                onSubmit={handlePostJob}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostJob;