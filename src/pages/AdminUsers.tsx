import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AdminUsers = () => {
  const { toast } = useToast();
  const [waitlistEntries, setWaitlistEntries] = React.useState<any[]>([]);
  const [loadingWaitlist, setLoadingWaitlist] = React.useState(true);
  const [totalUsers, setTotalUsers] = React.useState<number | null>(null);
  const [activeUsers, setActiveUsers] = React.useState<number | null>(null);
  const [pendingUsers, setPendingUsers] = React.useState<number | null>(null);
  const [adminsCount, setAdminsCount] = React.useState<number | null>(null);
  const [recentUsers, setRecentUsers] = React.useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = React.useState(true);
  const WAITLIST_PREVIEW_LIMIT = 5;

  // Fetch waitlist entries
  React.useEffect(() => {
    fetchWaitlist();
    fetchCounts();
    fetchRecentUsers();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching waitlist:', error);
        toast({
          title: "Error",
          description: "Failed to fetch waitlist entries",
          variant: "destructive",
        });
        return;
      }

      setWaitlistEntries(data || []);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
    } finally {
      setLoadingWaitlist(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      setLoadingRecent(true);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, first_name, last_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (profilesError) {
        console.error('Error fetching recent users:', profilesError);
        setRecentUsers([]);
        return;
      }

      const ids = (profiles || []).map((p: any) => p.user_id);
      let roleMap = new Map<string, string>();
      if (ids.length) {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', ids);
        if (rolesError) {
          console.warn('Error fetching roles for recent users:', rolesError);
        } else {
          roleMap = new Map(roles.map((r: any) => [r.user_id, r.role]));
        }
      }

      let mapped = (profiles || []).map((p: any) => ({
        id: p.user_id,
        name: [p.first_name, p.last_name].filter(Boolean).join(' ') || p.display_name || (p.email ? p.email.split('@')[0] : '—'),
        email: p.email || '—',
        role: roleMap.get(p.user_id) || 'client',
        status: 'active',
        joinDate: p.created_at,
      }));

      // Ensure current authenticated user is included at the top if missing
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const currentUser = userRes?.user ?? null;
        if (currentUser && !mapped.some(u => u.id === currentUser.id)) {
          const { data: meProfile } = await supabase
            .from('profiles')
            .select('user_id, display_name, first_name, last_name, email, created_at')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          if (meProfile) {
            // Fetch role for current user if not already in map
            let meRole = roleMap.get(currentUser.id) || 'client';
            if (!roleMap.has(currentUser.id)) {
              const { data: meRoleRow } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', currentUser.id)
                .maybeSingle();
              meRole = meRoleRow?.role || meRole;
            }
            const me = {
              id: meProfile.user_id,
              name: [meProfile.first_name, meProfile.last_name].filter(Boolean).join(' ') || meProfile.display_name || (meProfile.email ? meProfile.email.split('@')[0] : '—'),
              email: meProfile.email || '—',
              role: meRole,
              status: 'active',
              joinDate: meProfile.created_at,
            };
            mapped = [me, ...mapped];
          }
        }
      } catch {}

      // Sort by join date desc and limit to 5
      mapped.sort((a: any, b: any) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
      setRecentUsers(mapped.slice(0, 5));
    } catch (e) {
      console.error('Unexpected error fetching recent users:', e);
      setRecentUsers([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  const previewWaitlist = React.useMemo(() => {
    return waitlistEntries.slice(0, WAITLIST_PREVIEW_LIMIT);
  }, [waitlistEntries]);

  const fetchCounts = async () => {
    try {
      // Total users from profiles
      const { count: profilesCount, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id', { count: 'exact', head: true });

      if (profilesError) {
        console.error('Error counting profiles:', profilesError);
      }
      setTotalUsers(profilesCount ?? 0);

      // Admins count from user_roles
      const { count: adminsCnt, error: adminsError } = await supabase
        .from('user_roles')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (adminsError) {
        console.error('Error counting admins:', adminsError);
      }
      setAdminsCount(adminsCnt ?? 0);

      // Pending users from waitlist
      const { count: pendingCnt, error: pendingError } = await supabase
        .from('waitlist')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) {
        console.error('Error counting pending waitlist entries:', pendingError);
      }
      setPendingUsers(pendingCnt ?? 0);

      // Active users: treat all profile users as active
      setActiveUsers(profilesCount ?? 0);
    } catch (e) {
      console.error('Error fetching dashboard counts:', e);
    }
  };

  const updateWaitlistStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({ status })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update waitlist entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Waitlist entry ${status}`,
      });

      // Refresh waitlist data
      fetchWaitlist();
    } catch (error) {
      console.error('Error updating waitlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">User Management</h1>
            <p className="text-muted-foreground text-lg">Manage platform users and their permissions</p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalUsers === null ? '-' : totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeUsers === null ? '-' : activeUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
              <UserX className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingUsers === null ? '-' : pendingUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminsCount === null ? '-' : adminsCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitlistEntries.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations and updates</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/users/list">See All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loadingRecent ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading users...</div>
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No recent users found</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {String(user.name || '—').split(' ').filter(Boolean).map((n: string) => n[0]).join('') || '—'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <Badge variant={
                          user.status === 'active' ? 'default' : 
                          user.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {user.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

                    {/* Waitlist Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Waitlist Management</CardTitle>
                <CardDescription>Manage users waiting to join the platform</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/waitlist">See All</Link>
              </Button>
            </CardHeader>
          <CardContent>
            {loadingWaitlist ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading waitlist...</div>
              </div>
            ) : waitlistEntries.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No waitlist entries found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {previewWaitlist.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="space-y-3">
                      {/* Header: Name left, Status right */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-base">
                          {entry.first_name && entry.last_name 
                            ? `${entry.first_name} ${entry.last_name}` 
                            : entry.email.split('@')[0]
                          }
                        </h3>
                        <Badge 
                          variant={entry.status === 'pending' ? 'outline' : 
                                 entry.status === 'approved' ? 'default' : 'destructive'}
                          className={
                            entry.status === 'pending' 
                              ? 'border-orange-400 text-orange-600 dark:border-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20' 
                              : ''
                          }
                        >
                          {entry.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {entry.status} ●
                        </Badge>
                      </div>
                      
                      {/* Email */}
                      <p className="text-sm text-muted-foreground">{entry.email}</p>
                      
                      {/* Role */}
                      <p className="text-sm text-muted-foreground">
                        Role: <Badge variant="outline" className="ml-1">{entry.role}</Badge>
                      </p>
                      
                      {/* Location and Date on same line */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {entry.city && (
                            <span>📍 {entry.city}</span>
                          )}
                          <span>Joined: {new Date(entry.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Buttons positioned on the right */}
                        {entry.status === 'pending' && (
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateWaitlistStatus(entry.id, 'approved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateWaitlistStatus(entry.id, 'rejected')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {waitlistEntries.length > WAITLIST_PREVIEW_LIMIT && (
                  <div className="text-xs text-muted-foreground text-right">
                    Showing {WAITLIST_PREVIEW_LIMIT} of {waitlistEntries.length}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
