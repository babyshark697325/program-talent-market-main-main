import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import { mockSavedJobs } from "@/data/mockSavedJobs";
import PageHeader from '@/components/PageHeader';

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Simulate API delay for realistic demo
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Use mock saved jobs data for demo - get first 6 saved jobs
        const savedJobIds = mockSavedJobs.slice(0, 6).map(savedJob => savedJob.jobId);
        const savedJobsData = mockJobs.filter(job => 
          savedJobIds.includes(typeof job.id === 'string' ? parseInt(job.id) : job.id)
        );
        
        setSavedJobs(savedJobsData);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
        setSavedJobs([]);
      }
    };
    load();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleJobView = (id: number) => {
    navigate(`/job/${id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Saved Jobs" 
        description="Keep track of jobs you're interested in"
      />

      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedJobs.map((job, index) => (
            <div 
              key={job.id} 
              className="animate-fade-in hover:scale-[1.02] transition-transform duration-200"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <JobCard
                job={job}
                onView={() => handleJobView(Number(job.id))}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-secondary/60 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-primary/60" />
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
  );
};

export default SavedJobs;