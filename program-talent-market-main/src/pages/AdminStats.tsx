import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '../integrations/supabase/client';

const AdminStats = () => {
  const [platformStats, setPlatformStats] = React.useState<{
    label: string;
    value: string | number;
    change?: string;
    period?: string;
  }[]>([]);
  const [skillDemand, setSkillDemand] = React.useState<{ skill: string; demand: number }[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<{ action: string; user: string; time: string }[]>([]);
  const [financial, setFinancial] = React.useState({ revenue: 0, fees: 0, processing: 0, net: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total users (profiles)
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true });

        // Admins count
        const { count: admins } = await supabase
          .from('user_roles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'admin');

        // Pending waitlist
        const { count: pendingWaitlist } = await supabase
          .from('waitlist')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Active projects
        let activeProjects = 0;
        try {
          const { count: activeCount } = await supabase
            .from('jobs')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'active');
          activeProjects = activeCount ?? 0;
        } catch {}

        // Monthly revenue (this month, completed payments)
        let monthlyRevenue = 0;
        let paymentsRowsAny: any[] | null = null;
        try {
          const firstOfMonth = new Date();
          firstOfMonth.setDate(1);
          firstOfMonth.setHours(0, 0, 0, 0);
          const { data: paymentsRows } = await supabase
            .from('payments')
            .select('amount, status, created_at')
            .gte('created_at', firstOfMonth.toISOString())
            .eq('status', 'completed');
          paymentsRowsAny = paymentsRows as any[] | null;
          monthlyRevenue = (paymentsRowsAny || []).reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);
        } catch {}

        // Derive fees and costs
        const txCount = (paymentsRowsAny || []).length;
        const platformFees = monthlyRevenue * 0.10; // 10% platform fee (adjust as needed)
        const processingCosts = monthlyRevenue * 0.029 + txCount * 0.30; // 2.9% + $0.30/txn
        const netProfit = Math.max(0, monthlyRevenue - platformFees - processingCosts);
        setFinancial({ revenue: monthlyRevenue, fees: platformFees, processing: processingCosts, net: netProfit });

        setPlatformStats([
          { label: 'Total Users', value: totalUsers ?? 0 },
          { label: 'Admins', value: admins ?? 0 },
          { label: 'Pending Waitlist', value: pendingWaitlist ?? 0 },
          { label: 'Active Projects', value: activeProjects },
          { label: 'Monthly Revenue', value: `${monthlyRevenue.toLocaleString()}` },
        ]);
      } catch (e) {
        console.error('Error loading admin stats', e);
        setPlatformStats([
          { label: 'Total Users', value: 0 },
          { label: 'Admins', value: 0 },
          { label: 'Pending Waitlist', value: 0 },
          { label: 'Active Projects', value: 0 },
        ]);
      }
    };

    fetchStats();
  }, []);

  // Load skill demand (top 5 job skills by frequency)
  React.useEffect(() => {
    const fetchSkillDemand = async () => {
      try {
        const { data, error } = await supabase.from('jobs').select('skills');
        if (error) throw error;
        const counts = new Map<string, number>();
        (data || []).forEach((row: any) => {
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
      } catch (e) {
        setSkillDemand([]);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const since = new Date();
        since.setDate(since.getDate() - 7);
        const sinceIso = since.toISOString();

        const [profilesRes, jobsRes, reportsRes, paymentsRes, waitlistRes] = await Promise.allSettled([
          supabase.from('profiles').select('display_name, first_name, last_name, email, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(10),
          supabase.from('jobs').select('title, company, posted_at').gte('posted_at', sinceIso).order('posted_at', { ascending: false }).limit(10),
          supabase.from('reports').select('title, status, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(10),
          supabase.from('payments').select('amount, status, created_at').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(10),
          supabase.from('waitlist').select('id, email, first_name, last_name, role, city, created_at, status').order('created_at', { ascending: false }).limit(10),
        ]);

        const events: { action: string; user: string; time: string }[] = [];
        const push = (action: string, user: string, ts: string | Date) => {
          events.push({ action, user, time: new Date(ts).toLocaleString() });
        };

        if (profilesRes.status === 'fulfilled' && !profilesRes.value.error) {
          (profilesRes.value.data || []).forEach((p: any) => {
            const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.display_name || (p.email ? p.email.split('@')[0] : 'User');
            push('New user registered', name, p.created_at);
          });
        }
        if (jobsRes.status === 'fulfilled' && !jobsRes.value.error) {
          (jobsRes.value.data || []).forEach((j: any) => push('Job posted', `${j.title}${j.company ? ' @ ' + j.company : ''}`, j.posted_at));
        }
        if (reportsRes.status === 'fulfilled' && !reportsRes.value.error) {
          (reportsRes.value.data || []).forEach((r: any) => push('Report submitted', r.title || 'Report', r.created_at));
        }
        if (paymentsRes.status === 'fulfilled' && !paymentsRes.value.error) {
          (paymentsRes.value.data || []).forEach((pay: any) => {
            if (pay.status === 'completed') push('Payment processed', `${Number(pay.amount || 0).toLocaleString()}`, pay.created_at);
          });
        }

        if (waitlistRes.status === 'fulfilled' && !waitlistRes.value.error) {
          (waitlistRes.value.data || []).forEach((w: any) => {
            const name = [w.first_name, w.last_name].filter(Boolean).join(' ') || (w.email ? w.email.split('@')[0] : 'Guest');
            const details: string[] = [];
            if (w.role) details.push(w.role);
            if (w.city) details.push(w.city);
            push('Joined waitlist', `${name}${details.length ? ` (${details.join(', ')})` : ''}`, w.created_at);
          });
        }

        setRecentActivity(events.slice(0, 10));
      } catch (e) {
        setRecentActivity([]);
      }
    };

    fetchSkillDemand();
    fetchRecentActivity();
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
            {platformStats.map((stat, index) => (
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
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Demand</CardTitle>
                <CardDescription>Most in-demand skills on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillDemand.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.skill}</span>
                      <span>{item.demand}%</span>
                    </div>
                    <Progress value={item.demand} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Server Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">8.5/10</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2.4 hrs</div>
                  <p className="text-sm text-muted-foreground">Avg Session Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">76%</div>
                  <p className="text-sm text-muted-foreground">Return Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Revenue</span>
                  <span className="font-medium">${financial.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platform Fees</span>
                  <span className="font-medium">${financial.fees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processing Costs</span>
                  <span className="font-medium">${financial.processing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Net Profit</span>
                  <span>${financial.net.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
