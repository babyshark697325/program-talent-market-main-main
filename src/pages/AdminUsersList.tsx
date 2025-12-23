import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Users, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}


const AdminUsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch live users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data: profileRows, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, display_name, first_name, last_name, email, created_at')
          .order('created_at', { ascending: false });

        if (profileError) {
          console.error('Error fetching users', profileError);
          setUsers([]);
          setFilteredUsers([]);
          return;
        }

        const userIds = (profileRows || []).map((r: { user_id: string }) => r.user_id);
        let roleMap = new Map<string, string>();
        if (userIds.length) {
          const { data: roleRows, error: roleError } = await supabase
            .from('user_roles')
            .select('user_id, role')
            .in('user_id', userIds);

          if (roleError) {
            console.warn('Could not fetch roles, defaulting to client', roleError);
          } else {
            roleMap = new Map(roleRows.map((r: { user_id: string; role: string }) => [r.user_id, r.role]));
          }
        }

        const mapped: User[] = (profileRows || []).map((row: { user_id: string; first_name?: string; last_name?: string; display_name?: string; email?: string; created_at?: string }) => {
          const name =
            [row.first_name, row.last_name].filter(Boolean).join(' ') ||
            row.display_name ||
            (row.email ? row.email.split('@')[0] : '—');

          return {
            id: String(row.user_id),
            name,
            email: row.email || '—',
            role: roleMap.get(row.user_id) || 'client',
            status: 'active',
            createdAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '—',
          };
        });

        setUsers(mapped);
        setFilteredUsers(mapped);
      } catch (e) {
        console.error('Unexpected error fetching users', e);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setPage(1); // reset to page 1 when filters change
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleEditUser = (userId: string) => {
    // Navigate to edit user page
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    // Handle user deletion
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All Users
            </h1>
            <p className="text-muted-foreground">Manage all platform users</p>
          </div>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No users match your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredUsers.slice((page - 1) * pageSize, page * pageSize).map((user) => (
                  <div key={user.id} className="rounded-2xl border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5 p-4 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {(user.name || '—').split(' ').filter(Boolean).map(n => n[0]).join('') || '—'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium break-words whitespace-normal" title={user.name}>{user.name}</p>
                        <p className="text-sm text-muted-foreground break-words whitespace-normal" title={user.email}>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize">{user.role || '—'}</Badge>
                      <Badge
                        variant={
                          user.status === 'active' ? 'default' :
                            user.status === 'pending' ? 'secondary' :
                              user.status === 'inactive' ? 'destructive' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {user.status || '—'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Joined: {user.createdAt}</p>
                    <div className="mt-auto flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditUser(user.id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={page * pageSize >= filteredUsers.length} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersList;
