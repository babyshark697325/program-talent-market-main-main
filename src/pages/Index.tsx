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
import { JobPosting, mockJobs } from "@/data/mockJobs";
import { mockStudents } from "@/data/mockStudents";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { supabase } from "@/integrations/supabase/client";

// Database profile type from Supabase
interface DatabaseProfile {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Database job type from Supabase
interface DatabaseJob {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  description: string | null;
  requirements: string[];
  skills: string[];
  budget: string | null;
  duration: string | null;
  contact_email: string | null;
  status: "active" | "flagged" | "removed" | "completed";
  posted_at: string;
  created_at: string;
  updated_at: string;
}

// Transform database profile to StudentService format
const transformProfileToStudent = (profile: DatabaseProfile): StudentService => {
  const name = profile.display_name || 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 
    profile.email.split('@')[0];
  
  return {
    // Convert UUID to number for compatibility with existing routes
    id: parseInt(profile.id.slice(-8), 16),
    name,
    title: 'Student Developer',
    description: profile.bio || 'Skilled developer ready to help with your projects',
    avatarUrl: profile.avatar_url || '',
    skills: [],
    price: '$25/hr',
    affiliation: 'student' as const,
    aboutMe: profile.bio,
    contact: {
      email: profile.email,
      phone: undefined,
      linkedinUrl: undefined,
      githubUrl: undefined,
      upworkUrl: undefined,
      fiverrUrl: undefined,
    },
    portfolio: [],
  };
};

// Transform database job to JobPosting format
const transformDatabaseJobToJobPosting = (dbJob: DatabaseJob): JobPosting => {
  return {
    id: parseInt(dbJob.id.slice(-8), 16), // Convert string UUID to number
    title: dbJob.title,
    company: dbJob.company || "Unknown Company",
    description: dbJob.description || "No description provided",
    requirements: dbJob.requirements || [],
    skills: dbJob.skills || [],
    budget: dbJob.budget || "Budget not specified",
    duration: dbJob.duration || "Duration not specified",
    contactEmail: dbJob.contact_email || "",
    postedDate: dbJob.posted_at,
  };
};

// Spotlight settings constants
const LS_QUOTE_KEY = "spotlight.quote";
const LS_STUDENT_ID_KEY = "spotlight.studentId";
const LS_SHOWCASE_IMAGE_KEY = "spotlight.showcaseImage";
const LS_REVIEW_KEY = "spotlight.review";
const DEFAULT_QUOTE = "Building amazing web experiences is my passion. Every line of code I write aims to create something that users will love and businesses will thrive with!";
const DEFAULT_CLIENT_REVIEW = {
  text: "Alex built our entire e-commerce platform from scratch and it's been a game-changer for our business. The site is fast, beautiful, and user-friendly. Sales increased by 40% in the first month!",
  clientName: "Sarah Johnson, Store Owner",
  rating: 5
};

// Remove the duplicate FeaturedStudentProps interface (lines 107-116)
// Delete these lines:
// interface FeaturedStudentProps {
//   student: StudentService;
//   quote: string;
//   showcaseImage?: string;
//   clientReview: {
//     text: string;
//     clientName: string;
//     rating: number;
//   };
// }

const getSpotlightFromStorage = async (): Promise<{
  student: StudentService;
  quote: string;
  showcaseImage?: string;
  clientReview: {
    text: string;
    clientName: string;
    rating: number;
  };
} | null> => {
  const studentId = localStorage.getItem(LS_STUDENT_ID_KEY);
  const quote = localStorage.getItem(LS_QUOTE_KEY);
  const showcaseImage = localStorage.getItem(LS_SHOWCASE_IMAGE_KEY);
  const reviewId = localStorage.getItem(LS_REVIEW_KEY);

  if (!studentId) {
    return null;
  }

  try {
    // Fetch student profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', studentId)
      .single();

    if (profileError || !profile) {
      console.error('Student not found:', profileError);
      return null;
    }

    // Transform profile to student
    const transformedStudent = transformProfileToStudent(profile);

    // Fetch selected review if reviewId exists
    let clientReview = DEFAULT_CLIENT_REVIEW;
    if (reviewId) {
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .select('reviewer_name, reviewer_company, review_text, rating')
        .eq('id', reviewId)
        .single();

      if (!reviewError && review) {
        clientReview = {
          text: review.review_text,
          clientName: review.reviewer_company 
            ? `${review.reviewer_name}, ${review.reviewer_company}`
            : review.reviewer_name,
          rating: review.rating
        };
      }
    }

    return {
      student: transformedStudent,
      quote: quote || "Passionate about creating innovative solutions",
      showcaseImage: showcaseImage || undefined,
      clientReview
    };
  } catch (error) {
    console.error('Error loading spotlight data:', error);
    return null;
  }
};

const Index: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "jobs">("students");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [students, setStudents] = useState<StudentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [avgResponseHours, setAvgResponseHours] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();

  // Use mock students data instead of Supabase
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use mock students data
        setStudents(mockStudents);
        
        // Create featured student data using Alex Rivera from mock students
        const featuredStudent = mockStudents.find(student => student.name === "Alex Rivera") || mockStudents[0];
        const featuredData = {
          student: featuredStudent,
          quote: "I'm passionate about creating beautiful, functional web experiences that help businesses establish their online presence and connect with their customers.",
          showcaseImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=500&q=80",
          clientReview: {
            text: "Alex delivered an exceptional e-commerce website that exceeded our expectations. Professional communication, clean code, and delivered on time!",
            clientName: "Maria Santos, Boutique Owner",
            rating: 5
          }
        };
        setFeatured(featuredData);
      } catch (err) {
        console.error('Error loading mock students:', err);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Use mock jobs data instead of Supabase
  useEffect(() => {
    setJobs(mockJobs);
  }, []);

  // Use mock rating data instead of Supabase
  useEffect(() => {
    setAverageRating(4.5);
    setAvgResponseHours(3);
  }, []);

  // Memoized skills calculation
  const allSkills = useMemo(() => 
    Array.from(
      new Set([...students.flatMap((s) => s.skills), ...jobs.flatMap((j) => j.skills)])
    ), [students, jobs]
  );

  // Handle tab switching from sidebar navigation
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

  // Reload spotlight on focus or when admin saves settings
  useEffect(() => {
    const refresh = async () => {
      if (students.length > 0) {
        const featuredData = await getSpotlightFromStorage();
        setFeatured(featuredData);
      }
    };
    window.addEventListener('focus', refresh);
    window.addEventListener('spotlight:updated', refresh as EventListener);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('spotlight:updated', refresh as EventListener);
    };
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
        case "price":
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
          return priceA - priceB;
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
        job.description.toLowerCase().includes(searchLower) ||
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
          <FeaturedStudent 
            student={{
              id: featured?.student?.id || 1,
              name: featured?.student?.name || "Alex Rivera",
              title: featured?.student?.title || "Full-Stack Web Developer",
              avatarUrl: featured?.student?.avatarUrl || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
              skills: featured?.student?.skills || ["Web Development", "Programming", "UI/UX Design"],
              quote: featured?.quote || "I'm passionate about creating beautiful, functional web experiences that help businesses establish their online presence and connect with their customers.",
              showcaseImage: featured?.showcaseImage || "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=500&q=80",
              clientReview: featured?.clientReview || {
                text: "Alex delivered an exceptional e-commerce website that exceeded our expectations. Professional communication, clean code, and delivered on time!",
                clientName: "Maria Santos, Boutique Owner",
                rating: 5
              }
            }}
            onViewProfile={() => navigate(`/view-student/${featured?.student?.id || 1}`)}
          />

          {/* Browse Students/Jobs Hero Section */}
        <StatsGrid 
          studentsCount={students.length}
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
          onStudentView={(id) => navigate(`/view-student/${id}`)}
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
