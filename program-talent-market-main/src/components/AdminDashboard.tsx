
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
import { mockAdminActivities } from "@/adminActivityMockData";

interface AdminDashboardProps {
  jobs: JobPosting[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs }) => {

  // Mock admin statistics
  const adminStats = {
    totalUsers: mockStudents.length + 45, // Students + Clients
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => new Date(job.postedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    totalRevenue: 15750,
    pendingVerifications: 8,
    reportedIssues: 3
  };

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
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                System overview and management controls
              </p>
            </div>
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
                <h3 className="font-bold text-2xl text-blue-600">{adminStats.totalUsers}</h3>
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
                <h3 className="font-bold text-2xl text-green-600">{adminStats.activeJobs}</h3>
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
                <h3 className="font-bold text-2xl text-purple-600">${adminStats.totalRevenue.toLocaleString()}</h3>
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
                <h3 className="font-bold text-2xl text-orange-600">{adminStats.pendingVerifications}</h3>
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
            activities={mockAdminActivities}
            onActivityClick={handleActivityClick}
            maxItems={8}
          />
        </div>

        {/* Quick Stats Overview */}
        <Card className="p-8 bg-gradient-to-r from-secondary/70 to-primary/10 backdrop-blur-sm border border-primary/20">
          <h2 className="text-3xl font-bold mb-8 text-primary text-center">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">{mockStudents.length}</h3>
              <p className="text-muted-foreground">Registered Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">{adminStats.totalJobs}</h3>
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