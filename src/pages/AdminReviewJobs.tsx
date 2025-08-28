import React from "react";
import { useNavigate } from "react-router-dom";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Flag, FlagOff, Trash2, Building2, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Admin-facing view for reviewing, approving, flagging, or removing jobs.
// Uses mockJobs for now; replace with API calls when backend is ready.

type AdminJob = JobPosting & {
  status?: "flagged";
};

const AdminReviewJobs: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = React.useState<AdminJob[]>(() =>
    mockJobs.map((j) => ({ ...j }))
  );
  const [search, setSearch] = React.useState("");
  const [confirmId, setConfirmId] = React.useState<number | null>(null);

  const totals = React.useMemo(() => {
    const flagged = jobs.filter((j) => j.status === "flagged").length;
    return { total: jobs.length, flagged };
  }, [jobs]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) =>
      [job.title, job.company, job.description]
        .join("\n")
        .toLowerCase()
        .includes(q)
    );
  }, [jobs, search]);

  
  const flagJob = (id: number) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "flagged" } : j)));
    toast({ title: "Job flagged", description: `Job #${id} was flagged for review.` });
  };

  const unflagJob = (id: number) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: undefined } : j)));
    toast({ title: "Job unflagged", description: `Job #${id} was restored to active.` });
  };

  const removeJob = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setConfirmId(null);
    toast({ title: "Job removed", description: `Job #${id} was removed.` });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((job) => (
              <Card key={job.id} className="h-full flex flex-col">
                <CardContent className="pt-6 flex-1 flex flex-col overflow-visible">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold leading-snug">{job.title}</h3>
                    <Badge
                      className={
                        job.status === "flagged"
                          ? "bg-red-600 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-600"
                      }
                    >
                      {job.status === "flagged" ? "flagged" : "active"}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                    <Building2 size={14} />
                    <span>{job.company}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                    <DollarSign size={14} />
                    <span>{job.budget}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                    <Calendar size={14} />
                    <span>Posted {job.postedDate}</span>
                  </div>

                  <div className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {job.description}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 flex-wrap sm:flex-nowrap">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/job/${job.id}`)}>
                        <Eye className="mr-2" size={14} /> View
                      </Button>
                                            {job.status === "flagged" ? (
                        <Button size="sm" variant="outline" onClick={() => unflagJob(job.id)}>
                          <FlagOff className="mr-2" size={14} /> Unflag
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => flagJob(job.id)}>
                          <Flag className="mr-2" size={14} /> Flag
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="shrink-0"
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
              Are you sure you want to remove job #{confirmId}? This action cannot be undone.
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
