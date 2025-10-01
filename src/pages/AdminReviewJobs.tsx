import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Flag, FlagOff, Trash2, Building2, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockJobs, JobPosting } from "@/data/mockJobs";

// Convert JobPosting to match admin interface
type AdminJob = JobPosting & {
  status: 'active' | 'flagged' | 'removed' | 'completed';
  posted_at: string;
  user_id: string;
};

const AdminReviewJobs: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | number | null>(null);

  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Convert mock jobs to admin format
      const adminJobs: AdminJob[] = mockJobs.map(job => ({
        ...job,
        status: Math.random() > 0.8 ? 'flagged' : 'active' as 'active' | 'flagged' | 'removed' | 'completed',
        posted_at: job.postedDate,
        user_id: `user-${job.id}`
      }));
      
      setJobs(adminJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const totals = React.useMemo(() => {
    const flagged = jobs.filter((j) => j.status === "flagged").length;
    return { total: jobs.length, flagged };
  }, [jobs]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) =>
      [job.title, job.company || '', job.description || '']
        .join("\n")
        .toLowerCase()
        .includes(q)
    );
  }, [jobs, search]);

  const flagJob = async (id: string | number) => {
    try {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'flagged' as const } : j)));
      toast({ title: "Job flagged", description: `Job was flagged for review.` });
    } catch (error) {
      console.error('Error flagging job:', error);
      toast({
        title: "Error",
        description: "Failed to flag job",
        variant: "destructive",
      });
    }
  };

  const unflagJob = async (id: string | number) => {
    try {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'active' as const } : j)));
      toast({ title: "Job unflagged", description: `Job was restored to active.` });
    } catch (error) {
      console.error('Error unflagging job:', error);
      toast({
        title: "Error",
        description: "Failed to unflag job",
        variant: "destructive",
      });
    }
  };

  const removeJob = async (id: string | number) => {
    try {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast({ title: "Job removed", description: `Job was removed.` });
      setConfirmId(null);
    } catch (error) {
      console.error('Error removing job:', error);
      toast({
        title: "Error", 
        description: "Failed to remove job",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">
              Review Job Postings
            </h1>
            <p className="text-muted-foreground text-lg">
              Review, approve, flag, or remove client job postings
            </p>
          </div>

          {/* Search */}
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, company, or description"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Jobs</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Flagged</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totals.flagged}</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs list */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job) => (
              <Card key={job.id} className="h-full flex flex-col">
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 flex-1 h-14 flex items-start">{job.title}</h3>
                    <Badge
                      variant={job.status === "flagged" ? "destructive" : "default"}
                      className="shrink-0"
                    >
                      {job.status === "flagged" ? "flagged" : "active"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 h-20 flex flex-col justify-start">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building2 size={14} className="shrink-0" />
                      <span className="truncate">{job.company || 'No company specified'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign size={14} className="shrink-0" />
                      <span className="truncate">{job.budget || 'Budget not specified'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar size={14} className="shrink-0" />
                      <span>Posted {formatDate(job.posted_at)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-6 h-20 overflow-hidden flex items-start">
                    <p className="line-clamp-4 leading-relaxed">
                      {job.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/job/${job.id}`)}>
                        <Eye className="mr-2" size={14} /> View
                      </Button>
                      {job.status === "flagged" ? (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => unflagJob(job.id)}>
                          <FlagOff className="mr-2" size={14} /> Unflag
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => flagJob(job.id)}>
                          <Flag className="mr-2" size={14} /> Flag
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full"
                      onClick={() => setConfirmId(job.id)}
                    >
                      <Trash2 className="mr-2" size={14} /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/70 dark:bg-secondary/40 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500/10 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flag className="text-red-500/60" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">No Matching Jobs</h3>
              <p className="text-muted-foreground mb-6">Try changing your search or come back later.</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm remove dialog */}
      <Dialog open={confirmId !== null} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="max-w-md">
          <UIDialogHeader>
            <DialogTitle>Remove job posting</DialogTitle>
          </UIDialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove this job? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => removeJob(confirmId!)}>Remove</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviewJobs;
