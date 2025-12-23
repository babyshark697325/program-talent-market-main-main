import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from "@/integrations/supabase/client";

const AdminStats = () => {
  const [platformStats, setPlatformStats] = React.useState<{
    label: string;
    value: string | number;
    change?: string;
    period?: string;
  }[]>([]);
  const [skillDemand, setSkillDemand] = React.useState<{ skill: string; demand: number }[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<{ action: string; user: string; time: string }[]>([]);
  const [financial, setFinancial] = React.useState({ revenue: null as number | null, fees: null as number | null, processing: null as number | null, net: null as number | null });
  const [isLoading, setIsLoading] = React.useState(true);
  const [health, setHealth] = React.useState<{ dbLatencyMs: number | null; activeEvents: number | null; errorRatePct: number | null; uptimePct: number | null }>({
    dbLatencyMs: null,
    activeEvents: null,
    errorRatePct: null,
    uptimePct: null,
  });

  React.useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        // Define all interfaces first
        interface PaymentRow {
          amount: number | string | null;
          status: string;
          created_at: string;
        }
        interface JobRow {
          skills: string[] | unknown;
        }
        interface ProfileActivityRow {
          display_name?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          created_at: string;
        }
        interface JobActivityRow {
          title: string;
          company?: string;
          posted_at: string;
        }
        interface ReportActivityRow {
          title?: string;
          created_at: string;
        }
        interface PaymentActivityRow {
          amount: number | string | null;
          status: string;
          created_at: string;
        }
        interface WaitlistActivityRow {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          role?: string;
          city?: string;
          created_at: string;
          status: string;
        }

        // Fetch all data in parallel for faster loading
        const [statsRes, skillsRes, activityRes] = await Promise.allSettled([
          // Stats queries
          Promise.all([
            supabase.from('profiles').select('user_id', { count: 'exact', head: true }),
            supabase.from('user_roles').select('user_id', { count: 'exact', head: true }).eq('role', 'admin'),
            supabase.from('waitlist').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
            (() => {
              const firstOfMonth = new Date();
              firstOfMonth.setDate(1);
              firstOfMonth.setHours(0, 0, 0, 0);
              return supabase
                .from('payments')
                .select('amount, status, created_at')
                .gte('created_at', firstOfMonth.toISOString())
                .eq('status', 'completed');
            })()
          ]),
          // Skills data
          supabase.from('jobs').select('skills'),
          // Activity data
          (() => {
            const since = new Date();
            since.setDate(since.getDate() - 7);
            const sinceIso = since.toISOString();
            return Promise.allSettled([
              supabase.from('profiles').select('display_name, first_name, last_name, email, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(10),
              supabase.from('jobs').select('title, company, posted_at').gte('posted_at', sinceIso).order('posted_at', { ascending: false }).limit(10),
              supabase.from('applications').select('id, status, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(10),
              supabase.from('payments').select('amount, status, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(10),
              supabase.from('waitlist').select('id, email, first_name, last_name, role, city, created_at, status').order('created_at', { ascending: false }).limit(10),
            ]);
          })()
        ]);

        // Process stats
        if (statsRes.status === 'fulfilled') {
          const [usersRes, adminsRes, waitlistRes, jobsRes, paymentsRes] = statsRes.value;

          const totalUsers = usersRes.count ?? 0;
          const admins = adminsRes.count ?? 0;
          const pendingWaitlist = waitlistRes.count ?? 0;
          const activeProjects = jobsRes.count ?? 0;

          const paymentsRows = paymentsRes.data as PaymentRow[] || [];
          const monthlyRevenue = paymentsRows.reduce((sum: number, r) => sum + Number(r.amount || 0), 0);
          const txCount = paymentsRows.length;
          const platformFees = monthlyRevenue * 0.10;
          const processingCosts = monthlyRevenue * 0.029 + txCount * 0.30;
          const netProfit = Math.max(0, monthlyRevenue - platformFees - processingCosts);

          setFinancial({ revenue: monthlyRevenue, fees: platformFees, processing: processingCosts, net: netProfit });
          setPlatformStats([
            { label: 'Total Users', value: totalUsers },
            { label: 'Admins', value: admins },
            { label: 'Pending Waitlist', value: pendingWaitlist },
            { label: 'Active Projects', value: activeProjects },
            { label: 'Monthly Revenue', value: `${monthlyRevenue.toLocaleString()}` },
          ]);
        }

        // Process skills
        if (skillsRes.status === 'fulfilled' && skillsRes.value.data) {
          const counts = new Map<string, number>();
          (skillsRes.value.data as JobRow[]).forEach((row) => {
            const arr: string[] = Array.isArray(row.skills) ? row.skills : [];
            arr.forEach((s) => {
              const key = String(s || '').trim();
              if (!key) return;
              counts.set(key, (counts.get(key) || 0) + 1);
            });
          });
          const top = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([skill, demand]) => ({ skill, demand }));
          setSkillDemand(top);
        } else {
          setSkillDemand([]);
        }

        // Process activity
        if (activityRes.status === 'fulfilled') {
          const [profilesRes, jobsRes, applicationsRes, paymentsRes, waitlistRes] = activityRes.value;

          const events: { action: string; user: string; time: string }[] = [];
          const push = (action: string, user: string, ts: string | Date) => {
            events.push({ action, user, time: new Date(ts).toLocaleString() });
          };

          if (profilesRes.status === 'fulfilled' && !profilesRes.value.error) {
            (profilesRes.value.data as ProfileActivityRow[] || []).forEach((p) => {
              const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.display_name || (p.email ? p.email.split('@')[0] : 'User');
              push('New user registered', name, p.created_at);
            });
          }
          if (jobsRes.status === 'fulfilled' && !jobsRes.value.error) {
            (jobsRes.value.data as JobActivityRow[] || []).forEach((j) => push('Job posted', `${j.title}${j.company ? ' @ ' + j.company : ''}`, j.posted_at));
          }
          if (applicationsRes.status === 'fulfilled' && !applicationsRes.value.error) {
            (applicationsRes.value.data as { id: string; created_at: string }[] || []).forEach((a) => push('Application submitted', `Application #${a.id}`, a.created_at));
          }
          if (paymentsRes.status === 'fulfilled' && !paymentsRes.value.error) {
            (paymentsRes.value.data as PaymentActivityRow[] || []).forEach((pay) => {
              if (pay.status === 'completed') push('Payment processed', `${Number(pay.amount || 0).toLocaleString()}`, pay.created_at);
            });
          }
          if (waitlistRes.status === 'fulfilled' && !waitlistRes.value.error) {
            (waitlistRes.value.data as WaitlistActivityRow[] || []).forEach((w) => {
              const name = [w.first_name, w.last_name].filter(Boolean).join(' ') || (w.email ? w.email.split('@')[0] : 'Guest');
              const details: string[] = [];
              if (w.role) details.push(w.role);
              if (w.city) details.push(w.city);
              push('Joined waitlist', `${name}${details.length ? ` (${details.join(', ')})` : ''}`, w.created_at);
            });
          }

          setRecentActivity(events.slice(0, 10));
        } else {
          // Keep empty if no activity data available
          setRecentActivity([]);
        }

      } catch (e) {
        console.error('Error loading admin stats', e);
        // No mock fallback; keep empty/nulls
        setPlatformStats([]);
        setSkillDemand([]);
        setRecentActivity([]);
        setFinancial({ revenue: null, fees: null, processing: null, net: null });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Live platform health signals (derived from Supabase)
  React.useEffect(() => {
    const PINGS_KEY = 'platform.health.pings';
    const recordPing = (ok: boolean) => {
      try {
        const raw = localStorage.getItem(PINGS_KEY);
        const arr = Array.isArray(raw ? JSON.parse(raw) : []) ? JSON.parse(raw as string) : [];
        arr.push({ t: Date.now(), ok });
        while (arr.length > 100) arr.shift();
        localStorage.setItem(PINGS_KEY, JSON.stringify(arr));
      } catch {
        // Ignore storage error
      }
    };
    const computeUptime = (): number | null => {
      try {
        const raw = localStorage.getItem(PINGS_KEY);
        const arr = Array.isArray(raw ? JSON.parse(raw) : []) ? JSON.parse(raw as string) : [];
        if (!arr.length) return null;
        const ok = arr.filter((p: { ok: boolean }) => p?.ok).length;
        return Math.round(((ok / arr.length) * 100) * 10) / 10;
      } catch { return null; }
    };
    const measureDbLatency = async () => {
      const start = performance.now();
      const { error } = await supabase
        .from('profiles')
        .select('user_id', { count: 'exact', head: true })
        .limit(1);
      const ms = performance.now() - start;
      recordPing(!error);
      return { ms, ok: !error };
    };
    const fetchActivityAndErrors = async () => {
      const since15m = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [profilesRes, jobsRes, appsRes, paymentsRecentRes, paymentsDayRes] = await Promise.allSettled([
        supabase.from('profiles').select('user_id').gte('created_at', since15m),
        supabase.from('jobs').select('id').gte('posted_at', since15m),
        supabase.from('applications').select('id').gte('created_at', since15m),
        supabase.from('payments').select('id').gte('created_at', since15m),
        supabase.from('payments').select('id, status').gte('created_at', since24h),
      ]);
      let activeEvents = 0;
      if (profilesRes.status === 'fulfilled' && !profilesRes.value.error) activeEvents += profilesRes.value.data?.length || 0;
      if (jobsRes.status === 'fulfilled' && !jobsRes.value.error) activeEvents += jobsRes.value.data?.length || 0;
      if (appsRes.status === 'fulfilled' && !appsRes.value.error) activeEvents += appsRes.value.data?.length || 0;
      if (paymentsRecentRes.status === 'fulfilled' && !paymentsRecentRes.value.error) activeEvents += paymentsRecentRes.value.data?.length || 0;
      let errorRatePct: number | null = null;
      if (paymentsDayRes.status === 'fulfilled' && !paymentsDayRes.value.error) {
        const rows = (paymentsDayRes.value.data as { status: string }[]) || [];
        const total = rows.length;
        const failed = rows.filter((r) => r.status && String(r.status).toLowerCase() !== 'completed').length;
        errorRatePct = total > 0 ? (failed / total) * 100 : 0;
      }
      return { activeEvents, errorRatePct };
    };
    const run = async () => {
      try {
        const [{ ms }, { activeEvents, errorRatePct }] = await Promise.all([
          measureDbLatency(),
          fetchActivityAndErrors(),
        ]);
        setHealth({
          dbLatencyMs: ms,
          activeEvents,
          errorRatePct: errorRatePct ?? null,
          uptimePct: computeUptime(),
        });
      } catch {
        setHealth((h) => ({ ...h, uptimePct: computeUptime() }));
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">Platform Statistics</h1>
            <p className="text-muted-foreground text-lg">Comprehensive platform performance overview</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {isLoading ? (
              // Skeleton loading for stats cards
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              platformStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> {stat.period}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Demand</CardTitle>
                <CardDescription>Most in-demand skills on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  // Skeleton loading for skills
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-8"></div>
                      </div>
                      <div className="h-2 bg-muted animate-pulse rounded w-full"></div>
                    </div>
                  ))
                ) : (
                  skillDemand.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.skill}</span>
                        <span>{item.demand}%</span>
                      </div>
                      <Progress value={item.demand} className="h-2" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    // Skeleton loading for activities
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-muted animate-pulse rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                          <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
                        </div>
                        <div className="h-3 bg-muted animate-pulse rounded w-16"></div>
                      </div>
                    ))
                  ) : recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">by {activity.user}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Response</span>
                    <span className={health.dbLatencyMs != null && health.dbLatencyMs < 200 ? 'text-green-600' : ''}>
                      {health.dbLatencyMs != null ? `${Math.round(health.dbLatencyMs)}ms` : '—'}
                    </span>
                  </div>
                  <Progress value={health.dbLatencyMs != null ? Math.min(100, Math.max(0, 100 - (health.dbLatencyMs - 50))) : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime (client)</span>
                    <span className={health.uptimePct != null && health.uptimePct >= 99 ? 'text-green-600' : ''}>
                      {health.uptimePct != null ? `${health.uptimePct.toFixed(1)}%` : '—'}
                    </span>
                  </div>
                  <Progress value={health.uptimePct != null ? Math.min(100, Math.max(0, health.uptimePct)) : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Events (15m)</span>
                    <span>{health.activeEvents != null ? health.activeEvents : '—'}</span>
                  </div>
                  <Progress value={health.activeEvents != null ? Math.min(100, health.activeEvents) : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Error Rate (24h)</span>
                    <span className={health.errorRatePct != null && health.errorRatePct <= 1 ? 'text-green-600' : ''}>
                      {health.errorRatePct != null ? `${health.errorRatePct.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                  <Progress value={health.errorRatePct != null ? Math.min(100, health.errorRatePct) : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Avg Session Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Return Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  // Skeleton loading for financial data
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Revenue</span>
                      <span className="font-medium">{financial.revenue ? `$${financial.revenue.toLocaleString()}` : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Platform Fees</span>
                      <span className="font-medium">{financial.fees ? `$${financial.fees.toLocaleString()}` : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Costs</span>
                      <span className="font-medium">{financial.processing ? `$${financial.processing.toLocaleString()}` : '-'}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Net Profit</span>
                      <span>{financial.net ? `$${financial.net.toLocaleString()}` : '-'}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
