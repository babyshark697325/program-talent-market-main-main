import React, { useState, useEffect, useMemo } from "react";
import FeaturedStudent from "@/components/FeaturedStudent";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import WhyHireStudents from "@/components/WhyHireStudents";
import StatsGrid from "@/components/StatsGrid";
import TabNavigation from "@/components/TabNavigation";
import SearchFilters from "@/components/SearchFilters";
import ContentGrid from "@/components/ContentGrid";
import { StudentService } from "@/types/student";

import { JobPosting } from "@/types/job";
import { Job } from "@/integrations/supabase/types/jobs";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { supabase } from "@/integrations/supabase/client";

interface ReviewData {
  id: string;
  reviewer_name: string;
  reviewer_company: string | null;
  review_text: string;
  rating: number;
}

interface FeaturedData {
  student: {
    id: number | string;
    name: string;
    title: string;
    avatarUrl: string;
    skills: string[];
  };
  quote: string;
  showcaseImage?: string;
  clientReview: {
    text: string;
    clientName: string;
    rating: number;
  };
}
const Index: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "jobs">("students");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [students, setStudents] = useState<StudentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState<FeaturedData | null>(null);

  // Stats
  const [totalStudents, setTotalStudents] = useState(0);

  const [averageRating, setAverageRating] = useState<number>(0);
  const [avgResponseHours, setAvgResponseHours] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('prelaunch_signups')
          .select('*')
          .eq('role', 'student');
        if (error || !data) {
          setError('Failed to load students. Please try again.');
          setStudents([]);
        } else {
          setTotalStudents(data.length);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedStudents = data.map((dbStudent: any) => {
            const displayName = dbStudent.display_name || dbStudent.name || [dbStudent.first_name, dbStudent.last_name].filter(Boolean).join(' ') || dbStudent.email?.split('@')[0] || 'Unnamed Student';
            let affiliation: "student" | "alumni" = "student";
            if (dbStudent.affiliation === "alumni" || dbStudent.role === "alumni") {
              affiliation = "alumni";
            }
            return {
              id: dbStudent.id || parseInt((dbStudent.id || '').slice(-8), 16),
              cic_id: dbStudent.cic_id || dbStudent.id,
              name: displayName,
              title: dbStudent.title || 'Student',
              description: dbStudent.description || 'This student has not added a description yet.',
              avatarUrl: dbStudent.avatar_url || '',
              skills: Array.isArray(dbStudent.skills) ? dbStudent.skills : [],
              price: dbStudent.price || '$25/hr',
              affiliation,
              aboutMe: dbStudent.aboutMe || '',
              contact: dbStudent.contact || {
                email: dbStudent.email || '',
                phone: dbStudent.phone || '',
                linkedinUrl: dbStudent.linkedinUrl || '',
                githubUrl: dbStudent.githubUrl || '',
                upworkUrl: dbStudent.upworkUrl || '',
                fiverrUrl: dbStudent.fiverrUrl || '',
              },
              portfolio: Array.isArray(dbStudent.portfolio) ? dbStudent.portfolio : [],
            };
          });
          setStudents(mappedStudents);

          // Try to load featured student from DB config
          try {
            const { data: configData } = await supabase
              .from('spotlight_config')
              .select('*')
              .maybeSingle();

            if (configData && configData.student_id) {
              const featuredStudent = mappedStudents.find(s => s.id === parseInt(configData.student_id as string));
              if (featuredStudent) {
                const reviewData = configData.review_data as unknown as ReviewData | null;
                setFeatured({
                  student: {
                    id: featuredStudent.id,
                    name: featuredStudent.name,
                    title: featuredStudent.title,
                    avatarUrl: featuredStudent.avatarUrl,
                    skills: featuredStudent.skills || [],
                  },
                  quote: configData.quote || featuredStudent.aboutMe || "",
                  showcaseImage: configData.showcase_image || undefined,
                  clientReview: reviewData ? {
                    text: reviewData.review_text,
                    clientName: reviewData.reviewer_company || reviewData.reviewer_name,
                    rating: reviewData.rating
                  } : {
                    text: "Fantastic work! Delivered on time and exceeded expectations.",
                    clientName: "Verified Client",
                    rating: 5
                  }
                });
              } else {
                // Configured student not found in current list (maybe hidden?), fallback to random
                const randomStudent = mappedStudents[Math.floor(Math.random() * mappedStudents.length)];
                setFeatured({
                  student: {
                    id: randomStudent.id,
                    name: randomStudent.name,
                    title: randomStudent.title,
                    avatarUrl: randomStudent.avatarUrl,
                    skills: randomStudent.skills || [],
                  },
                  quote: randomStudent.aboutMe ? randomStudent.aboutMe.substring(0, 150) + "..." : "I'm passionate about creating exciting projects and delivering high-quality work for my clients.",
                  clientReview: {
                    text: "Fantastic work! Delivered on time and exceeded expectations.",
                    clientName: "Verified Client",
                    rating: 5
                  }
                });
              }
            } else if (mappedStudents.length > 0) {
              // No config, use random
              const randomStudent = mappedStudents[Math.floor(Math.random() * mappedStudents.length)];
              setFeatured({
                student: {
                  id: randomStudent.id,
                  name: randomStudent.name,
                  title: randomStudent.title,
                  avatarUrl: randomStudent.avatarUrl,
                  skills: randomStudent.skills || [],
                },
                quote: randomStudent.aboutMe ? randomStudent.aboutMe.substring(0, 150) + "..." : "I'm passionate about creating exciting projects and delivering high-quality work for my clients.",
                clientReview: {
                  text: "Fantastic work! Delivered on time and exceeded expectations.",
                  clientName: "Verified Client",
                  rating: 5
                }
              });
            }
          } catch (e) {
            console.error("Error loading spotlight config in Index:", e);
            // Fallback to random
            if (mappedStudents.length > 0) {
              const randomStudent = mappedStudents[Math.floor(Math.random() * mappedStudents.length)];
              setFeatured({
                student: {
                  id: randomStudent.id,
                  name: randomStudent.name,
                  title: randomStudent.title,
                  avatarUrl: randomStudent.avatarUrl,
                  skills: randomStudent.skills || [],
                },
                quote: randomStudent.aboutMe ? randomStudent.aboutMe.substring(0, 150) + "..." : "I'm passionate about creating exciting projects and delivering high-quality work for my clients.",
                clientReview: {
                  text: "Fantastic work! Delivered on time and exceeded expectations.",
                  clientName: "Verified Client",
                  rating: 5
                }
              });
            }
          }
        }
      } catch (err) {
        console.error('Error loading students:', err);
        setError('Failed to load students. Please try again.');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mappedJobs: JobPosting[] = data.map((job: Job) => ({
            id: job.id,
            title: job.title,
            company: job.company || "Unknown",
            description: job.description || "",
            skills: job.skills || [],
            budget: job.budget || "Not specified",
            duration: job.duration || "Not specified",
            postedDate: job.created_at || new Date().toISOString(),
            contactEmail: job.contact_email || "",
            location: job.location || "Remote",
            experienceLevel: job.experience_level || "Any"
          }));
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    setAverageRating(4.5);
    setAvgResponseHours(3);
  }, []);

  const allSkills = useMemo(() => {
    return Array.from(
      new Set([...students.flatMap((s) => s.skills), ...jobs.flatMap((j) => j.skills)])
    );
  }, [students, jobs]);

  useEffect(() => {
    const st = location.state as { activeTab?: string; scrollTo?: string } | null;
    if (st?.activeTab) {
      setActiveTab(st.activeTab as "students" | "jobs");
      // scroll target handling after a tick to allow render
      const target = st?.scrollTo;
      setTimeout(() => {
        if (target === 'students') {
          const el = document.getElementById('students-section');
          if (el) {
            const offset = 96; // scroll a bit less so it's not too low
            const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          }
        }
      }, 0);
      // Clear the state to prevent it from persisting
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    // Removed getSpotlightFromStorage reference due to missing import
    // If you need to refresh featured student, implement logic here
    // window.addEventListener('focus', refresh);
    // window.addEventListener('spotlight:updated', refresh as EventListener);
    // return () => {
    //   window.removeEventListener('focus', refresh);
    //   window.removeEventListener('spotlight:updated', refresh as EventListener);
    // };
  }, [students]);

  const filteredStudents = useMemo(() => {
    const searchLower = search.toLowerCase();

    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.title.toLowerCase().includes(searchLower) ||
        student.skills.some((skill) => skill.toLowerCase().includes(searchLower));
      const matchSkill = !selectedSkill || student.skills.includes(selectedSkill);
      return matchSearch && matchSkill;
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price": {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
          return priceA - priceB;
        }
        case "rating":
          return 0; // Could be implemented with actual rating data
        default:
          return 0;
      }
    });
  }, [students, search, selectedSkill, sortBy]);

  const filteredJobs = useMemo(() => {
    const searchLower = search.toLowerCase();
    return jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchLower));
      const matchSkill = !selectedSkill || job.skills.includes(selectedSkill);
      return matchSearch && matchSkill;
    });
  }, [jobs, search, selectedSkill]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedSkill(null);
    setSortBy("name");
  };

  // Always show the public/client homepage, regardless of role

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-1/3 w-96 h-96 bg-gradient-to-tl from-accent/15 to-primary/10 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-gradient-to-tr from-primary/5 to-accent/10 rounded-full blur-2xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>

      <HeroSection />

      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pb-16 relative z-10">
        {/* Sections with proper spacing */}
        <div className="space-y-14">
          {/* How It Works Section - First Card */}
          <HowItWorks />

          {/* Why Hire Students Section */}
          <WhyHireStudents />

          {/* Featured Student Section - Always show with mock data */}

          {featured && (
            <FeaturedStudent
              student={{
                id: featured.student.id,
                name: featured.student.name,
                title: featured.student.title,
                avatarUrl: featured.student.avatarUrl,
                skills: featured.student.skills,
                quote: featured.quote,
                showcaseImage: featured.showcaseImage,
                clientReview: featured.clientReview
              }}
              onViewProfile={() => navigate(`/view-student/${featured.student.id}`)}
            />
          )}

          {/* Browse Students/Jobs Hero Section */}
          <StatsGrid
            studentsCount={totalStudents}
            skillsCount={allSkills.length}
            averageRating={averageRating}
            responseTimeHours={avgResponseHours}
          />
          {/* Anchor for scrolling to just after the Discover card */}
          <div id="students-section" />
        </div>

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentsCount={students.length}
          jobsCount={jobs.length}
        />


        <SearchFilters
          search={search}
          setSearch={setSearch}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          activeTab={activeTab}
          allSkills={allSkills}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultsCount={activeTab === "students" ? filteredStudents.length : filteredJobs.length}
        />

        <ContentGrid
          activeTab={activeTab}
          filteredStudents={filteredStudents}
          filteredJobs={filteredJobs}
          onStudentView={(cic_id) => navigate(`/view-student/${cic_id}`)}
          onJobView={(id) => navigate(`/job/${id}`)}
          onClearFilters={handleClearFilters}
        />

        {/* Enhanced Footer */}
        <footer className="text-center mt-24 pb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-transparent via-primary/10 to-transparent h-px mb-8"></div>
          <p className="text-muted-foreground text-sm opacity-80 font-medium">
            &copy; {new Date().getFullYear()} MyVillage Program &middot; All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
