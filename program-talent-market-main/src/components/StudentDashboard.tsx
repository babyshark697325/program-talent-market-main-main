
import React from "react";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, TrendingUp } from "lucide-react";
import { JobPosting } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { useNavigate } from "react-router-dom";

interface StudentDashboardProps {
  jobs: JobPosting[];
  setActiveTab: (tab: "students" | "jobs") => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ jobs, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-1/3 w-96 h-96 bg-gradient-to-tl from-accent/15 to-primary/10 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-gradient-to-tr from-primary/5 to-accent/10 rounded-full blur-2xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Student Dashboard Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium mb-8">
              Track your progress, explore opportunities, and level up your skills
            </p>
          </div>
        </div>
      </div>

      {/* Student Quick Stats */}
      <div className="max-w-6xl mx-auto w-full px-6 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-secondary/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <Award className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-primary">12</h3>
                <p className="text-muted-foreground">Skills Mastered</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-2xl flex items-center justify-center">
                <Briefcase className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-accent">8</h3>
                <p className="text-muted-foreground">Projects Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-green-600">$2,450</h3>
                <p className="text-muted-foreground">Earnings This Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Jobs Section */}
        <div className="bg-gradient-to-r from-secondary/60 to-primary/10 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-primary/10 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">Available Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={() => navigate(`/job/${job.id}`)}
              />
            ))}
          </div>
          <div className="text-center mt-6">
            <Button onClick={() => setActiveTab("jobs")} className="bg-gradient-to-r from-primary to-primary/80">
              View All Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
