import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PostJobForm from "@/components/PostJobForm";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JobPosting } from "@/types/job";
import { Job } from "@/integrations/supabase/types/jobs";


interface JobFormData {
  title: string;
  company?: string;
  description: string;
  skills?: string;
  budget: string;
  duration?: string;
  contactEmail?: string;
}
const ManageJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBudgetRange, setTotalBudgetRange] = useState("$0-0");



  // Fetch jobs from Supabase
  const fetchJobs = React.useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const userJobs: JobPosting[] = data.map((job: Job) => ({
          ...job,
          id: job.id,
          postedDate: job.posted_date,
          contactEmail: job.contact_email,
          experienceLevel: job.experience_level,
          location: job.location || "Remote",
          requirements: job.requirements || []
        }));
        setJobs(userJobs);

        // Calculate budget range
        if (userJobs.length > 0) {
          const budgets = userJobs
            .map(job => {
              // Extract both min and max from budget ranges like "$2,000 - $3,500"
              const matches = job.budget.match(/\$(\d+,?\d*)\s*-\s*\$(\d+,?\d*)/);
              if (matches) {
                const min = parseInt(matches[1].replace(/,/g, ''));
                const max = parseInt(matches[2].replace(/,/g, ''));
                return { min, max };
              }
              // Fallback for simple budgets
              const singleMatch = job.budget.match(/\$(\d+,?\d*)/);
              const value = singleMatch ? parseInt(singleMatch[1].replace(/,/g, '')) : 0;
              return { min: value, max: value };
            })
            .filter(budget => budget.min > 0);

          if (budgets.length > 0) {
            const minBudget = Math.min(...budgets.map(b => b.min));
            const maxBudget = Math.max(...budgets.map(b => b.max));
            setTotalBudgetRange(`$${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()}`);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      // Silently handle errors - no user-facing error messages
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobView = (id: string | number) => {
    navigate(`/job/${id}`, { state: { clientView: true } });
  };

  const handlePostJob = async (formData: JobFormData) => {
    if (!user) {
      setError("Please log in to post a job");
      return;
    }

    try {
      setError(null);

      const newJob = {
        title: formData.title,
        company: formData.company || "Your Company",
        description: formData.description,
        skills: formData.skills ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        budget: formData.budget,
        duration: formData.duration || "To be discussed",
        contact_email: formData.contactEmail || user.email || "contact@yourcompany.com",
        posted_date: new Date().toISOString().split('T')[0],
        location: "Remote",
        experience_level: "Mid",
        requirements: [],
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Refresh jobs list
        fetchJobs();
        setIsPostJobOpen(false);
      }
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err instanceof Error ? err.message : 'Failed to post job');
    }
  };

  const handleDeleteJob = async (id: string | number) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh jobs
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">
              Manage Your Jobs
            </h1>
            <p className="text-muted-foreground text-lg">
              Create, edit, and track your job postings
            </p>
          </div>

          <Dialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus size={20} />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>
              <PostJobForm
                onSubmit={handlePostJob}
                onCancel={() => setIsPostJobOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Remove the error alert section completely */}
        {/* {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Jobs</h3>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Jobs</h3>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{jobs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Budget Range</h3>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBudgetRange}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {jobs.map((job, index) => (
              <div key={job.id} className="relative group h-full flex flex-col">
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit functionality would go here
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="animate-fade-in hover:scale-[1.02] transition-transform duration-200 h-full flex flex-col"
                  style={{ animationDelay: `${0.1 * index}s` }}>
                  <JobCard
                    job={{ ...job, location: "Remote" as const, experienceLevel: "Entry" as const }}
                    onView={() => handleJobView(job.id)}
                    hideBookmark
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-card/70 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="text-primary/40" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Jobs Posted Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start by posting your first job to connect with talented students.
              </p>
              <Button
                onClick={() => setIsPostJobOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Post Your First Job
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
