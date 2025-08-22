
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { supabase } from '../integrations/supabase/client';

const AdminAnalytics = () => {
  const [userGrowthData, setUserGrowthData] = React.useState<{ month: string; users: number }[]>([]);
  const [userTypeData, setUserTypeData] = React.useState<{ name: string; value: number; color: string }[]>([]);
  const [jobPostingData, setJobPostingData] = React.useState<{ month: string; jobs: number }[]>([]);
  const [metrics, setMetrics] = React.useState<{ revenue: number; activeProjects: number; completionRate: number | null; avgResponseHours: number | null }>({
    revenue: 0,
    activeProjects: 0,
    completionRate: null,
    avgResponseHours: null,
  });

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Load profiles for the last 6 months and aggregate by month
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', sixMonthsAgo.toISOString());

        if (!profilesError) {
          const months: { label: string; key: string }[] = [];
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString(undefined, { month: 'short' });
            months.push({ label, key });
          }
          const counts = new Map(months.map((m) => [m.key, 0] as [string, number]));
          (profiles || []).forEach((p: any) => {
            const d = new Date(p.created_at);
            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (counts.has(k)) counts.set(k, (counts.get(k) || 0) + 1);
          });
          setUserGrowthData(months.map((m) => ({ month: m.label, users: counts.get(m.key) || 0 })));
        } else {
          setUserGrowthData([]);
          console.warn('Profiles growth fetch error', profilesError);
        }

        // Load role distribution
        const { data: rolesRows, error: rolesError } = await supabase
          .from('user_roles')
          .select('role');

        if (!rolesError) {
          const counts: Record<string, number> = { student: 0, client: 0, admin: 0 };
          (rolesRows || []).forEach((r: any) => {
            if (r.role === 'student' || r.role === 'client' || r.role === 'admin') {
              counts[r.role] = (counts[r.role] || 0) + 1;
            }
          });
          setUserTypeData([
            { name: 'Students', value: counts.student || 0, color: '#3b82f6' },
            { name: 'Clients', value: counts.client || 0, color: '#10b981' },
            { name: 'Admins', value: counts.admin || 0, color: '#f59e0b' },
          ]);
        } else {
          // If not admin or error, fall back to zeros
          setUserTypeData([
            { name: 'Students', value: 0, color: '#3b82f6' },
            { name: 'Clients', value: 0, color: '#10b981' },
            { name: 'Admins', value: 0, color: '#f59e0b' },
          ]);
          console.warn('Roles distribution fetch error', rolesError);
        }
      // Jobs: aggregate postings over last 6 months
        const sixMonthsAgoJobs = new Date();
        sixMonthsAgoJobs.setMonth(sixMonthsAgoJobs.getMonth() - 5);
        sixMonthsAgoJobs.setHours(0, 0, 0, 0);
        const { data: jobsRows, error: jobsError } = await supabase
          .from('jobs')
          .select('posted_at, status')
          .gte('posted_at', sixMonthsAgoJobs.toISOString());
        if (!jobsError) {
          const monthsJ: { label: string; key: string }[] = [];
          const nowJ = new Date();
          for (let i = 5; i >= 0; i--) {
            const d = new Date(nowJ.getFullYear(), nowJ.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString(undefined, { month: 'short' });
            monthsJ.push({ label, key });
          }
          const countsJ = new Map(monthsJ.map((m) => [m.key, 0] as [string, number]));
          (jobsRows || []).forEach((r: any) => {
            const d = new Date(r.posted_at);
            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (countsJ.has(k)) countsJ.set(k, (countsJ.get(k) || 0) + 1);
          });
          setJobPostingData(monthsJ.map((m) => ({ month: m.label, jobs: countsJ.get(m.key) || 0 })));
        } else {
          setJobPostingData([]);
        }

        // Active projects and completion rate from jobs
        let activeProjects = 0;
        const { count: activeCount } = await supabase
          .from('jobs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');
        activeProjects = activeCount ?? 0;

        let completionRate: number | null = null;
        const { data: statusRows } = await supabase
          .from('jobs')
          .select('status');
        if (statusRows && statusRows.length) {
          const totalCompleted = statusRows.filter((r: any) => r.status === 'completed').length;
          const relevant = statusRows.filter((r: any) => r.status === 'completed' || r.status === 'active').length;
          completionRate = relevant > 0 ? (totalCompleted / relevant) * 100 : null;
        }

        // Revenue (current month) from payments if table exists
        let revenue = 0;
        const firstOfMonth = new Date();
        firstOfMonth.setDate(1);
        firstOfMonth.setHours(0, 0, 0, 0);
        try {
          const { data: paymentsRows, error: paymentsError } = await supabase
            .from('payments')
            .select('amount, status, created_at')
            .gte('created_at', firstOfMonth.toISOString())
            .eq('status', 'completed');
          if (!paymentsError) {
            revenue = (paymentsRows || []).reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);
          }
        } catch {}

        setMetrics((m) => ({
          ...m,
          revenue,
          activeProjects,
          completionRate,
          avgResponseHours: null,
        }));
      } catch (e) {
        console.error('Analytics load error', e);
      }
    };

    fetchAnalytics();
  }, []);

  
  
  const GrowthTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-sm">
          <div className="font-medium">{label}</div>
          <div className="text-muted-foreground">Users: <span className="font-semibold text-foreground">{value}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight mb-2">System Analytics</h1>
            <p className="text-muted-foreground text-lg">Platform performance metrics and insights</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeProjects}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completionRate !== null ? `${metrics.completionRate.toFixed(1)}%` : '—'}</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgResponseHours !== null ? `${metrics.avgResponseHours.toFixed(1)}h` : '—'}</div>
              <p className="text-xs text-muted-foreground">-15min from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    content={<GrowthTooltip />}
                    cursor={{ stroke: 'var(--color-border, #e5e7eb)', strokeDasharray: '4 4' }}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Monthly job posting activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobPostingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Platform user types breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>System performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Server Uptime</span>
                <span className="text-sm text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database Response</span>
                <span className="text-sm text-green-600">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Sessions</span>
                <span className="text-sm">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-green-600">0.01%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
