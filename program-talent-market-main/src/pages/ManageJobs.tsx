
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PostJobForm from "@/components/PostJobForm";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const handleJobView = (id: number) => {
    navigate(`/job/${id}`);
  };

  const handlePostJob = (formData: any) => {
    const newJob: JobPosting = {
      id: jobs.length + 1,
      title: formData.title,
      company: formData.company || "Your Company",
      description: formData.description,
      requirements: formData.skills ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      skills: formData.skills ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      budget: formData.budget,
      duration: formData.duration || "To be discussed",
      postedDate: new Date().toISOString().split('T')[0],
      contactEmail: formData.contactEmail || "contact@yourcompany.com",
    };

    setJobs([newJob, ...jobs]);
    setIsPostJobOpen(false);
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

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
                <div className="text-2xl font-bold">$25-150</div>
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
                
                <div className="animate-fade-in hover:scale-105 transition-transform duration-300 h-full flex flex-col"
                     style={{ animationDelay: `${0.1 * index}s` }}>
                  <JobCard
                    job={job}
                    onView={() => handleJobView(job.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
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
