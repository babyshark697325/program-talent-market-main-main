import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Flag, MessageSquare, User } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  reporter_name: string | null;
  reported_name: string | null;
  status: string;
  priority: string;
  created_at: string;
  resolved_at: string | null;
}

const AdminReports = () => {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id,type,title,description,reporter_name,reported_name,status,priority,created_at,resolved_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setReports((data || []) as unknown as Report[]);
      } catch (e) {
        console.warn('Reports fetch error', e);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const openReports = React.useMemo(() => reports.filter(r => r.status !== 'resolved').length, [reports]);
  const investigatingCount = React.useMemo(() => reports.filter(r => r.status === 'investigating').length, [reports]);
  const resolvedToday = React.useMemo(() => {
    const today = new Date().toDateString();
    return reports.filter(r => r.status === 'resolved' && r.resolved_at && new Date(r.resolved_at).toDateString() === today).length;
  }, [reports]);
  const avgResolutionDays = React.useMemo(() => {
    const resolved = reports.filter(r => r.status === 'resolved' && r.resolved_at);
    if (!resolved.length) return null;
    const sumDays = resolved.reduce((acc, r) => acc + (new Date(r.resolved_at!).getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24), 0);
    return (sumDays / resolved.length).toFixed(1);
  }, [reports]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'investigating': return 'default';
      case 'resolved': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'job': return Flag;
      case 'payment': return AlertTriangle;
      default: return MessageSquare;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">Reports & Issues</h1>
            <p className="text-muted-foreground text-lg">Monitor and resolve platform issues</p>
          </div>
          <Button>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openReports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
              <Flag className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investigatingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResolutionDays ? `${avgResolutionDays} days` : '—'}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest reported issues and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => {
                const Icon = getTypeIcon(report.type);
                return (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reported by: {report.reporter_name || '—'} • Against: {report.reported_name || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</span>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
