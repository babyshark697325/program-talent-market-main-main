import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { JobPosting } from "@/types/job";
import PageHeader from '@/components/PageHeader';
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<JobPosting[]>([]);
  const { savedJobIds } = useSavedJobs();

  useEffect(() => {
    const load = async () => {
      try {
        if (savedJobIds.length === 0) {
          setSavedJobs([]);
          return;
        }

        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .in('id', savedJobIds);

        if (error) throw error;


        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedJobs: JobPosting[] = data.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company || "Unknown",
            description: job.description || "",
            skills: job.skills || [],
            budget: job.budget || "Not specified",
            duration: job.duration || "Not specified",
            postedDate: job.created_at || new Date().toISOString(),
            contactEmail: job.contact_email || "",
            location: job.location || "Remote",
            experienceLevel: job.experience_level || "Any",
            applicantsCount: job.applicants_count || 0,
            isNew: false,
            isRemote: job.is_remote
          }));
          setSavedJobs(mappedJobs);
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
        setSavedJobs([]);
      }
    };
    load();
  }, [savedJobIds]);

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