
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";

const SavedJobs = () => {
  const navigate = useNavigate();
  // For demo purposes, we'll show first 3 jobs as "saved"
  const [savedJobs] = useState<JobPosting[]>(mockJobs.slice(0, 3));

  const handleJobView = (id: number) => {
    navigate(`/job/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Saved Jobs
          </h1>
          <p className="text-muted-foreground text-lg">
            Keep track of jobs you're interested in
          </p>
        </div>

        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedJobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <JobCard
                  job={job}
                  onView={() => handleJobView(job.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-secondary/60 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💾</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Saved Jobs Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Save jobs you're interested in to easily find them later.
              </p>
              <Button 
                onClick={() => navigate("/browse-jobs")}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Browse Jobs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
