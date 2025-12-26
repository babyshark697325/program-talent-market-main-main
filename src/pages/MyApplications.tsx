import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Eye, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from '@/components/PageHeader';

// Render-facing type used by this page
interface Application {
  id: string; // primary key
  jobId: string | null;  // related job id
  jobTitle: string;
  company: string;
  appliedDate: string; // ISO date
  status: "pending" | "hired" | "rejected" | "reviewed" | "shortlisted" | "interviewed" | string;
  budget: string; // formatted string
  duration: string;
  clientResponse?: {
    message: string;
    date: string;
  };
}

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        // Try to fetch from 'applications' table
        // We assume it has columns: id, job_id, status, created_at, budget, duration ...
        // and a relation to 'jobs'
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            budget,
            duration,
            job_id,
            jobs (
              title,
              company
            )
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // If table doesn't exist or other error, fallback to empty
          console.warn('Could not fetch applications (table might be missing):', error);
          if (isMounted) setApplications([]);
        } else if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: Application[] = data.map((row: any) => ({
            id: row.id,
            jobId: row.job_id,
            jobTitle: row.jobs?.title || 'Unknown Job',
            company: row.jobs?.company || 'Unknown Company',
            appliedDate: row.created_at,
            status: row.status || 'pending',
            budget: row.budget ? `$${row.budget}` : 'Not specified',
            duration: row.duration || 'Not specified'
          }));
          if (isMounted) setApplications(mapped);
        }
      } catch (err) {
        console.error('Error loading applications:', err);
        if (isMounted) {
          // setError('Failed to load applications'); // Don't show error to user if it's just missing table
          setApplications([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusBadge = (status: string) => (
    <Badge
      variant={status === 'hired' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
      className="text-xs px-2 py-0.5 rounded-full capitalize"
    >
      {status}
    </Badge>
  );

  const total = applications.length;
  const hired = applications.filter((a) => a.status === "hired").length;
  const pending = applications.filter((a) => a.status === "pending").length;

  // Show only first 4 applications by default in 2x2 grid
  const displayedApplications = showAll ? applications : applications.slice(0, 4);
  const hasMore = applications.length > 4;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="My Applications"
          description="Track the status of your job applications"
        />

        {/* KPI cards - keeping consistent with other pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "—" : total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Hired</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{loading ? "—" : hired}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{loading ? "—" : pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 text-sm text-destructive">Error: {error}</div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading applications…</div>
        ) : applications.length > 0 ? (
          <div className="space-y-6">
            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedApplications.map((application) => (
                <Card key={application.id} className="h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex flex-col space-y-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold leading-tight truncate">{application.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground truncate">{application.company}</p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground flex-1">
                        <div className="flex justify-between">
                          <span>Applied:</span>
                          <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span className="font-medium">{application.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{application.duration}</span>
                        </div>
                      </div>

                      {application.clientResponse && (
                        <div className="p-3 bg-muted/50 rounded-md">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Client Response</p>
                          <p className="text-sm line-clamp-2">{application.clientResponse.message}</p>
                        </div>
                      )}

                      <div className="mt-auto pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/job/${application.jobId}`)}
                          className="w-full flex items-center justify-center gap-2"
                          title="View Job"
                        >
                          <Eye size={16} />
                          View Job Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-2"
                >
                  {showAll ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-4 h-4" />
                      Show All ({applications.length} applications)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-secondary/60 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="w-12 h-12 text-primary/60" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">No Applications Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start applying to jobs to track your applications here.
              </p>
              <Button onClick={() => navigate("/browse-jobs")} className="bg-gradient-to-r from-primary to-primary/80">
                Browse Jobs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
