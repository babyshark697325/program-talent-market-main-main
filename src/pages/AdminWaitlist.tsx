import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WaitlistEntry {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  city: string | null;
  status: string;
  created_at: string;
}

const AdminWaitlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<WaitlistEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setWaitlistEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to fetch waitlist entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = waitlistEntries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.first_name && entry.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.last_name && entry.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.city && entry.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(entry => entry.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    setFilteredEntries(filtered);
  }, [waitlistEntries, searchTerm, roleFilter, statusFilter]);

  const updateWaitlistStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setWaitlistEntries(prev => 
        prev.map(entry => 
          entry.id === id ? { ...entry, status } : entry
        )
      );

      toast({
        title: "Success",
        description: `Entry ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update entry status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Are you sure you want to delete this waitlist entry?')) {
      try {

        const { error, data } = await supabase
          .from('waitlist')
          .delete()
          .eq('id', id);
        console.log('[Delete] Attempted to delete id:', id, 'Result:', { error, data });

        if (error) throw error;

        await fetchWaitlist();
        toast({
          title: "Success",
          description: "Entry deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast({
          title: "Error",
          description: "Failed to delete entry",
          variant: "destructive",
        });
      }
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
              Waitlist Management
            </h1>
            <p className="text-muted-foreground">Manage all waitlist applications</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">{waitlistEntries.length}</p>
          <p className="text-sm text-muted-foreground">Total Entries</p>
        </div>
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
                placeholder="Search entries..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Waitlist Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entries ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {entry.first_name && entry.last_name 
                        ? `${entry.first_name} ${entry.last_name}` 
                        : entry.email.split('@')[0]
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">{entry.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{entry.role}</Badge>
                      {entry.city && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {entry.city}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined: {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <Badge variant={
                    entry.status === 'pending' ? 'secondary' : 
                    entry.status === 'approved' ? 'default' : 'destructive'
                  }>
                    {entry.status}
                  </Badge>
                  {entry.status === 'pending' && (
                    <>
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
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWaitlist;
