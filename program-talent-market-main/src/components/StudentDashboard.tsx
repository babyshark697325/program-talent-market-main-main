
import React from "react";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, TrendingUp } from "lucide-react";
import { JobPosting } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BackToTop from "./BackToTop";

interface StudentDashboardProps {
  jobs: JobPosting[];
  setActiveTab: (tab: "students" | "jobs") => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ jobs, setActiveTab }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Quick stats from local storage or backend (placeholder keys)
  const [stats, setStats] = React.useState({ skills: 0, projects: 0, earnings: 0 });
  React.useEffect(() => {
    const load = () => {
      const skills = Number(localStorage.getItem('skillsMastered') || '0');
      const projects = Number(localStorage.getItem('projectsCompleted') || '0');
      const earnings = Number(localStorage.getItem('earningsThisMonth') || '0');
      setStats({
        skills: isNaN(skills) ? 0 : skills,
        projects: isNaN(projects) ? 0 : projects,
        earnings: isNaN(earnings) ? 0 : earnings,
      });
    };
    load();
    const handler = () => load();
    window.addEventListener('storage', handler);
    window.addEventListener('progress:updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('progress:updated', handler);
    };
  }, []);

  // Recommended jobs: pick active or recent as a simple heuristic
  const recommendedJobs = React.useMemo(() => {
    const active = jobs.filter((j) => (j.status ? String(j.status).toLowerCase() === 'active' : true));
    return active.slice(0, 6);
  }, [jobs]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
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
                <h3 className="font-bold text-2xl text-primary">{stats.skills}</h3>
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
                <h3 className="font-bold text-2xl text-accent">{stats.projects}</h3>
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
                <h3 className="font-bold text-2xl text-green-600">${stats.earnings.toLocaleString()}</h3>
                <p className="text-muted-foreground">Earnings This Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Jobs Section */}
        <div className="bg-gradient-to-r from-secondary/60 to-primary/10 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-primary/10 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary">Recommended Opportunities</h2>
            <Button 
              onClick={() => navigate("/browse-jobs")} 
              variant="outline"
            >
              View All Jobs
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.length > 0 ? (
              recommendedJobs.slice(0, 6).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={() => navigate(`/job/${job.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground text-lg">No recommended opportunities found based on your skills.</p>
                <Button 
                  onClick={() => setActiveTab("jobs")} 
                  className="mt-4 bg-gradient-to-r from-primary to-primary/80"
                >
                  Browse All Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default StudentDashboard;