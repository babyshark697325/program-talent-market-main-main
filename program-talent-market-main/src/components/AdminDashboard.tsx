
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  BookOpen
} from "lucide-react";
import { mockStudents } from "@/data/mockStudents";
import { JobPosting } from "@/data/mockJobs";
import { Link } from "react-router-dom";
import RecentActivity from "./RecentActivity";
import { supabase } from "../integrations/supabase/client";
import { AdminActivity, ActivityType, ActivityStatus } from "@/types/adminActivity";

interface AdminDashboardProps {
  jobs: JobPosting[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs }) => {
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [totalJobs, setTotalJobs] = React.useState(0);
  const [activeJobs, setActiveJobs] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [pendingReviews, setPendingReviews] = React.useState(0);
  const [activities, setActivities] = React.useState<AdminActivity[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true });
        if (!cancelled) setTotalUsers(usersCount ?? 0);

        // Jobs counts
        const [{ count: jobsCount }, { count: activeCount }] = await Promise.all([
          supabase.from('jobs').select('id', { count: 'exact', head: true }),
          supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        ]);
        if (!cancelled) {
          setTotalJobs(jobsCount ?? 0);
          setActiveJobs(activeCount ?? 0);
        }

        // Payments revenue (all-time or adjust to month if desired)
        try {
          const { data: paymentsRows, error: paymentsError } = await supabase
            .from('payments')
            .select('amount, status');
          if (!paymentsError && paymentsRows) {
            const sum = paymentsRows
              .filter((r: any) => r.status === 'completed')
              .reduce((acc: number, r: any) => acc + Number(r.amount || 0), 0);
            if (!cancelled) setTotalRevenue(sum);
          } else if (!paymentsRows && !cancelled) {
            setTotalRevenue(0);
          }
        } catch {
          if (!cancelled) setTotalRevenue(0);
        }

        // Pending reviews aggregate: waitlist pending + open reports + flagged jobs
        let pending = 0;
        try {
          const [{ count: waitlistPending }, { count: openReports }, { count: flaggedJobs }] = await Promise.all([
            supabase.from('waitlist').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('reports').select('id', { count: 'exact', head: true }).neq('status', 'resolved'),
            supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'flagged'),
          ]);
          pending = (waitlistPending ?? 0) + (openReports ?? 0) + (flaggedJobs ?? 0);
        } catch {
          // Tables may not exist or RLS may block; keep pending as what we could compute
        }
        if (!cancelled) setPendingReviews(pending);
      } catch (e) {
        if (!cancelled) {
          setTotalUsers(0);
          setTotalJobs(0);
          setActiveJobs(0);
          setTotalRevenue(0);
          setPendingReviews(0);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const loadActivities = async () => {
      try {
        const since = new Date();
        since.setDate(since.getDate() - 14); // last 14 days
        const sinceIso = since.toISOString();

        // Fetch recent items from multiple sources
        const [profilesRes, jobsRes, paymentsRes, reportsRes] = await Promise.allSettled([
          supabase.from('profiles').select('user_id, display_name, first_name, last_name, email, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(20),
          supabase.from('jobs').select('id, title, company, posted_at').gte('posted_at', sinceIso).order('posted_at', { ascending: false }).limit(20),
          supabase.from('payments').select('id, amount, status, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(20),
          supabase.from('reports').select('id, title, status, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(20),
        ]);

        let id = 1;
        const events: AdminActivity[] = [];

        // Profiles → user registration
        if (profilesRes.status === 'fulfilled' && !profilesRes.value.error && profilesRes.value.data) {
          for (const p of profilesRes.value.data as any[]) {
            events.push({
              id: id++,
              type: ActivityType.USER_REGISTRATION,
              message: `New user registered: ${[p.first_name, p.last_name].filter(Boolean).join(' ') || p.display_name || (p.email ? p.email.split('@')[0] : 'User')}`,
              timestamp: new Date(p.created_at),
              status: ActivityStatus.SUCCESS,
              data: { user_id: p.user_id, email: p.email },
            });
          }
        }

        // Jobs → job posted
        if (jobsRes.status === 'fulfilled' && !jobsRes.value.error && jobsRes.value.data) {
          for (const j of jobsRes.value.data as any[]) {
            events.push({
              id: id++,
              type: ActivityType.JOB_POSTED,
              message: `Job posted: ${j.title}${j.company ? ` at ${j.company}` : ''}`,
              timestamp: new Date(j.posted_at),
              status: ActivityStatus.SUCCESS,
              data: { job_id: j.id, title: j.title, company: j.company },
            });
          }
        }

        // Payments → payment processed
        if (paymentsRes.status === 'fulfilled' && !paymentsRes.value.error && paymentsRes.value.data) {
          for (const pay of paymentsRes.value.data as any[]) {
            if (pay.status === 'completed') {
              events.push({
                id: id++,
                type: ActivityType.PAYMENT_PROCESSED,
                message: `Payment processed: ${Number(pay.amount || 0).toLocaleString()}`,
                timestamp: new Date(pay.created_at),
                status: ActivityStatus.SUCCESS,
                data: { payment_id: pay.id, amount: pay.amount },
              });
            }
          }
        }

        // Reports → user reports
        if (reportsRes.status === 'fulfilled' && !reportsRes.value.error && reportsRes.value.data) {
          for (const r of reportsRes.value.data as any[]) {
            const st = String(r.status || '').toLowerCase();
            const map: Record<string, ActivityStatus> = {
              pending: ActivityStatus.WARNING,
              investigating: ActivityStatus.INFO,
              resolved: ActivityStatus.SUCCESS,
            };
            events.push({
              id: id++,
              type: ActivityType.USER_REPORTS,
              message: `Report: ${r.title}`,
              timestamp: new Date(r.created_at),
              status: map[st] ?? ActivityStatus.INFO,
              data: { report_id: r.id, status: r.status },
            });
          }
        }

        // Sort newest first and limit
        events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const limited = events.slice(0, 50);
        if (!cancelled) setActivities(limited);
      } catch (e) {
        if (!cancelled) setActivities([]);
      }
    };

    loadActivities();
    return () => { cancelled = true; };
  }, []);

  const handleActivityClick = (activityId: number) => {
    console.log('Activity clicked:', activityId);
    // In a real app, this would navigate to activity details or perform an action
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-1/3 w-96 h-96 bg-gradient-to-tl from-accent/15 to-primary/10 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Admin Dashboard Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              System overview and management controls
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 pb-16 relative z-10">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-secondary/40 backdrop-blur-sm border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-blue-600">{totalUsers}</h3>
                <p className="text-muted-foreground">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary/40 backdrop-blur-sm border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Briefcase className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-green-600">{activeJobs}</h3>
                <p className="text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary/40 backdrop-blur-sm border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-purple-600">${totalRevenue.toLocaleString()}</h3>
                <p className="text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary/40 backdrop-blur-sm border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-orange-600">{pendingReviews}</h3>
                <p className="text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-r from-secondary/60 to-primary/10 backdrop-blur-sm border border-primary/10">
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
              <Settings size={28} />
              System Management
            </h2>
            <div className="space-y-4">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/users">
                  <Users className="mr-2" size={18} />
                  Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/review-jobs">
                  <Briefcase className="mr-2" size={18} />
                  Review Job Postings
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/settings">
                  <Shield className="mr-2" size={18} />
                  Security Settings
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/analytics">
                  <BarChart3 className="mr-2" size={18} />
                  View Analytics
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/spotlight">
                  <TrendingUp className="mr-2" size={18} />
                  Spotlight Success
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/learning-resources">
                  <BookOpen className="mr-2" size={18} />
                  Learning Resources Settings
                </Link>
              </Button>
            </div>
          </Card>

          <RecentActivity 
            activities={activities}
            onActivityClick={handleActivityClick}
            maxItems={8}
          />
        </div>

        {/* Quick Stats Overview */}
        <Card className="p-8 bg-gradient-to-r from-secondary/70 to-primary/10 backdrop-blur-sm border border-primary/20">
          <h2 className="text-3xl font-bold mb-8 text-primary text-center">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">{totalUsers}</h3>
              <p className="text-muted-foreground">Registered Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">{totalJobs}</h3>
              <p className="text-muted-foreground">Total Job Postings</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-600 mb-2">98.5%</h3>
              <p className="text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;