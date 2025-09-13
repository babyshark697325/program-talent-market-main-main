import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { supabase } from "@/integrations/supabase/client";
import { JobPosting } from "@/data/mockJobs";
import PageHeader from '@/components/PageHeader';

const SavedJobs = () => {
  const navigate = useNavigate();
  const { savedJobIds } = useSavedJobs();
  const [savedJobs, setSavedJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!savedJobIds.length) { 
          setSavedJobs([]); 
          return; 
        }
        
        // Convert number IDs to strings for UUID comparison
        const stringIds = savedJobIds.map(id => id.toString());
        
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, company, description, skills, budget, duration, status, posted_at, contact_email')
          .in('id', stringIds);
          
        if (error) throw error;
        
        // Transform the data to match JobPosting interface
        const transformedJobs: JobPosting[] = (data || []).map(job => ({
          id: parseInt(job.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for compatibility
          title: job.title,
          company: job.company || 'Unknown Company',
          description: job.description || '',
          skills: job.skills || [],
          budget: job.budget || 'Not specified',
          duration: job.duration || 'Not specified',
          postedDate: job.posted_at ? new Date(job.posted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          contactEmail: job.contact_email || 'contact@company.com'
        }));
        
        setSavedJobs(transformedJobs);
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