import React from "react";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, TrendingUp } from "lucide-react";
import JobCard from "@/components/JobCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import { mockStudentApplications } from "@/data/mockStudentApplications";
import { mockSavedJobs } from "@/data/mockSavedJobs";
import BackToTop from "./BackToTop";

// Updated interface - removed jobs prop

// Job interface matching mock data
type Job = JobPosting;

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = React.useState<string[]>([]);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = React.useState(true);
  const [jobsError, setJobsError] = React.useState<string | null>(null);

  // Use mock data instead of Supabase
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        // Simulate API delay for realistic demo
        await new Promise(resolve => setTimeout(resolve, 500));

        // Use mock data
        setJobs(mockJobs);
      } catch (err) {
        console.error('Error loading mock jobs:', err);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Use mock user skills for demo
  React.useEffect(() => {
    const fetchUserSkills = async () => {
      if (!user) return;

      try {
        // Use mock skills for demo - representing a student interested in web development
        const demoSkills = ["Web Development", "Programming", "UI/UX Design", "React", "JavaScript"];
        setUserSkills(demoSkills);
      } catch (err) {
        console.error('Error loading user skills:', err);
        setUserSkills([]);
      }
    };

    fetchUserSkills();
  }, [user]);

  // Function to get day-based greeting
  const getDayGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    let dayMessage = "Ready to tackle some exciting projects today?";

    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
      dayMessage = "Hope you're having a productive day!";
    } else if (hour >= 17) {
      timeGreeting = "Good evening";
      dayMessage = "Time to wind down or work on passion projects?";
    }

    return { timeGreeting, dayMessage };
  };

  const getDisplayName = () => {
    if (!user) return "Student";
    return (
      (user.user_metadata?.display_name as string) ||
      (user.user_metadata?.first_name as string) ||
      (user.email as string)?.split('@')[0] ||
      "Student"
    );
  };

  const { timeGreeting, dayMessage } = getDayGreeting();
  const displayName = getDisplayName();

  // Quick stats from local storage or backend (placeholder keys)
  const [stats, setStats] = React.useState({ skills: 0, projects: 0, earnings: 0 });
  React.useEffect(() => {
    const load = () => {
      // Use mock data for demo stats based on our student applications
      const hiredApplications = mockStudentApplications.filter(app => app.status === 'hired');
      const completedProjects = hiredApplications.length;
      // Calculate estimated earnings from hired projects (parsing budget strings)
      const totalEarnings = hiredApplications.reduce((sum, app) => {
        const budgetMatch = app.proposedBudget.match(/\$?(\d+(?:,\d{3})*)/);
        const amount = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 0;
        return sum + amount;
      }, 0);
      const skillsCount = 12; // Representing various skills learned

      setStats({
        skills: skillsCount,
        projects: completedProjects,
        earnings: totalEarnings,
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

  // Skill-based job recommendations
  const recommendedJobs = React.useMemo(() => {
    if (userSkills.length === 0) {
      // If user has no skills, show recent jobs
      return jobs.slice(0, 6);
    }

    // Calculate skill match score for each job
    const jobsWithScore = jobs.map(job => {
      const matchingSkills = job.skills.filter(skill =>
        userSkills.some(userSkill =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );

      return {
        job,
        score: matchingSkills.length,
        matchingSkills
      };
    });

    // Sort by skill match score (descending) and take top 6
    return jobsWithScore
      .filter(item => item.score > 0) // Only jobs with at least one matching skill
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.job);
  }, [jobs, userSkills]);

  // Convert Supabase job to JobCard format
  const convertJobForCard = (job: Job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    skills: job.skills,
    budget: job.budget,
    duration: job.duration,
    postedDate: job.postedDate,
    contactEmail: job.contactEmail,
    location: "Remote", // Default since not in schema
    experienceLevel: "All Levels" // Default since not in schema
  });

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
        <div className="relative z-10 pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight tracking-tight">
              Your Dashboard
            </h1>

            {/* Greeting */}
            <p className="text-xl md:text-2xl font-medium text-foreground/90">
              {timeGreeting}, {displayName}!
            </p>

            {/* Motivational Line */}
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {dayMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Breathing room before Stats Cards */}
      <div className="h-8"></div>

      {/* Student Quick Stats */}
      <div className="max-w-6xl mx-auto w-full px-6 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-secondary/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/15">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Award className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-primary">{stats.skills}</h3>
                <p className="text-muted-foreground">Skills Mastered</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/15">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl flex items-center justify-center">
                <Briefcase className="text-accent-foreground" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-accent">{stats.projects}</h3>
                <p className="text-muted-foreground">Projects Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/15">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-green-600">${stats.earnings}</h3>
                <p className="text-muted-foreground">Earnings This Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Jobs Section */}
        <div className="bg-gradient-to-r from-secondary/60 to-primary/10 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-primary/10 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-primary">Recommended Opportunities</h2>
            <Button
              onClick={() => navigate("/browse-jobs")}
              variant="outline"
            >
              View All Jobs
            </Button>
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-lg">Loading opportunities...</p>
            </div>
          ) : jobsError ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg mb-4">{jobsError}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.slice(0, 6).map((job) => (
                  <JobCard
                    key={job.id}
                    job={({
                      ...convertJobForCard(job),
                      location: "Remote" as const // Explicitly type as literal "Remote"
                    })}
                    onView={() => navigate(`/job/${job.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground text-lg">
                    {userSkills.length === 0
                      ? "Complete your profile with skills to get personalized job recommendations."
                      : "No opportunities found matching your skills. Check back later for new postings!"
                    }
                  </p>
                  <Button
                    onClick={() => userSkills.length === 0 ? navigate("/profile") : navigate("/browse-jobs")}
                    className="mt-4 bg-gradient-to-r from-primary to-primary/80"
                  >
                    {userSkills.length === 0 ? "Complete Profile" : "Browse All Jobs"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default StudentDashboard;