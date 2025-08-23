import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// Render-facing type used by this page
interface Application {
  applicationId: string; // primary key of applications row
  jobId: string | null;  // related job id (if join succeeds)
  jobTitle: string;
  company: string;
  appliedDate: string; // ISO date
  status: "pending" | "accepted" | "rejected" | string;
  budget: string; // formatted string (e.g., "$300")
}

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      // 1) Get current user
      const { data: userData, error: authErr } = await supabase.auth.getUser();
      if (authErr) {
        if (isMounted) {
          setError(authErr.message);
          setLoading(false);
        }
        return;
      }

      const userId = userData?.user?.id;
      if (!userId) {
        if (isMounted) {
          setError("Not signed in");
          setApplications([]);
          setLoading(false);
        }
        return;
      }

      // 2) Query applications and join the related job (adjust table/column names if different in your DB)
      // Assumes: applications(user_id, status, created_at, budget, job_id)
      //          jobs(id, title, company)
      const { data, error: qErr } = await supabase
        .from("applications")
        .select(
          "id, status, created_at, budget, jobs:job_id ( id, title, company )"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (qErr) {
        setError(qErr.message);
        setApplications([]);
        setLoading(false);
        return;
      }

      const mapped: Application[] = (data ?? []).map((row: any) => {
        // Format budget as a currency-looking string if numeric; otherwise pass-through
        let budgetStr = "";
        if (typeof row?.budget === "number") {
          budgetStr = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(row.budget);
        } else if (typeof row?.budget === "string") {
          budgetStr = row.budget;
        } else {
          budgetStr = "$0";
        }

        return {
          applicationId: row.id,
          jobId: row?.jobs?.id ?? null,
          jobTitle: row?.jobs?.title ?? "Unknown Role",
          company: row?.jobs?.company ?? "Unknown Company",
          appliedDate: row?.created_at ?? new Date().toISOString(),
          status: row?.status ?? "pending",
          budget: budgetStr,
        } as Application;
      });

      setApplications(mapped);
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    } as const;

    const cls = (variants as any)[status] ?? "bg-secondary text-foreground";

    return (
      <Badge className={cls}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const total = applications.length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const pending = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">
            My Applications
          </h1>
          <p className="text-muted-foreground text-lg">
            Track the status of your job applications
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <h3 className="text-sm font-medium text-muted-foreground">Accepted</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{loading ? "—" : accepted}</div>
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
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.applicationId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(application.status)}
                        <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <p className="text-muted-foreground mb-2">{application.company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                        <span>Budget: {application.budget}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/job/${application.jobId ?? application.applicationId}`)}
                      className="flex items-center gap-2"
                      disabled={!application.jobId}
                      title={!application.jobId ? "Job not available" : "View Job"}
                    >
                      <Eye size={16} />
                      View Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-secondary/60 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📋</span>
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
