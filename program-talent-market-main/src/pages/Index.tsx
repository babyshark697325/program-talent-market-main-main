import React, { useState, useEffect, useMemo } from "react";
import FeaturedStudent from "@/components/FeaturedStudent";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import HeroSection from "@/components/HeroSection";
import StatsGrid from "@/components/StatsGrid";
import TabNavigation from "@/components/TabNavigation";
import SearchFilters from "@/components/SearchFilters";
import ContentGrid from "@/components/ContentGrid";
import { StudentService } from "@/data/mockStudents";
import { mockJobs, JobPosting } from "@/data/mockJobs";
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

// Transform database profile to StudentService format
const transformProfileToStudent = (profile: DatabaseProfile): StudentService => {
  const name = profile.display_name || 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 
    profile.email.split('@')[0];
  
  return {
    // Convert UUID to number for compatibility with existing routes
    id: parseInt(profile.id.slice(-8), 16),
    name,
    title: 'Student Developer', // Default title since profiles don't have specific titles
    description: profile.bio || 'Skilled developer ready to help with your projects',
    avatarUrl: profile.avatar_url || 
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80',
    skills: [], // Default empty skills - could be enhanced later
    price: '$25/hr', // Default price
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
    portfolio: [], // Default empty portfolio
  };
};

// Import the DatabaseStudent interface from BrowseStudents
export interface DatabaseStudent {
  id: string;
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  hourly_rate: number;
  bio?: string;
  location?: string;
  availability: string;
  rating: number;
  total_jobs: number;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
  student_portfolio: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    project_url?: string;
  }[];
}

// Transform database student to component format
const transformStudent = (dbStudent: DatabaseStudent): StudentService => {
  return {
    // Convert UUID to number for compatibility with existing routes
    id: parseInt(dbStudent.id.slice(-8), 16),
    name: dbStudent.name,
    // Use bio as title, fallback to default
    title: dbStudent.bio || 'Student Developer',
    description: dbStudent.bio || 'Skilled developer ready to help with your projects',
    avatarUrl:
      dbStudent.profile_image_url ||
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80',
    skills: dbStudent.skills || [],
    price: `$${dbStudent.hourly_rate || 25}/hr`,
    // Default to student since we're in students table
    affiliation: 'student' as const,
    aboutMe: dbStudent.bio,
    contact: {
      email: dbStudent.email,
      phone: undefined,
      linkedinUrl: undefined,
      githubUrl: undefined,
      upworkUrl: undefined,
      fiverrUrl: undefined,
    },
    portfolio: (dbStudent.student_portfolio || []).map((item) => ({
      id: parseInt(item.id.slice(-8), 16),
      title: item.title,
      description: item.description,
      imageUrl: item.image_url || '',
      link: item.project_url,
    })),
  };
};

// Spotlight settings constants
const LS_QUOTE_KEY = "spotlight.quote";
const LS_STUDENT_ID_KEY = "spotlight.studentId";
const LS_SHOWCASE_IMAGE_KEY = "spotlight.showcaseImage";
const DEFAULT_QUOTE = "Building amazing web experiences is my passion. Every line of code I write aims to create something that users will love and businesses will thrive with!";
const DEFAULT_CLIENT_REVIEW = {
  text: "Alex built our entire e-commerce platform from scratch and it's been a game-changer for our business. The site is fast, beautiful, and user-friendly. Sales increased by 40% in the first month!",
  clientName: "Sarah Johnson, Store Owner",
  rating: 5
};

function getSpotlightFromStorage(students: StudentService[]) {
  try {
    const q = localStorage.getItem(LS_QUOTE_KEY) || "";
    const sid = localStorage.getItem(LS_STUDENT_ID_KEY);
    const img = localStorage.getItem(LS_SHOWCASE_IMAGE_KEY) || "";
    const id = sid ? Number(sid) : (students[0]?.id || 1);
    const s = students.find((m) => m.id === id) || students[0];
    
    if (!s) {
      return {
        id: 1,
        name: "Featured Student",
        title: "Student Developer",
        avatarUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80',
        skills: [],
        quote: DEFAULT_QUOTE,
        clientReview: DEFAULT_CLIENT_REVIEW
      };
    }
    
    const orientation = localStorage.getItem('spotlight.orientation');
    
    return {
      id: s.id,
      name: s.name,
      title: s.title,
      avatarUrl: s.avatarUrl,
      skills: s.skills,
      quote: q || DEFAULT_QUOTE,
      showcaseImage: img || undefined,
      showcaseOrientation: orientation === 'portrait' ? 'portrait' : 'landscape',
      clientReview: DEFAULT_CLIENT_REVIEW
    };
  } catch {
    const s = students[0];
    if (!s) {
      return {
        id: 1,
        name: "Featured Student",
        title: "Student Developer",
        avatarUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80',
        skills: [],
        quote: DEFAULT_QUOTE,
        clientReview: DEFAULT_CLIENT_REVIEW
      };
    }
    return {
      id: s.id,
      name: s.name,
      title: s.title,
      avatarUrl: s.avatarUrl,
      skills: s.skills,
      quote: DEFAULT_QUOTE,
      clientReview: DEFAULT_CLIENT_REVIEW
    };
  }
}

const Index: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "jobs">("students");
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [students, setStudents] = useState<StudentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();

  // Fetch student profiles from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get profiles for users with 'student' role
        const { data: studentRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'student');

        if (rolesError) {
          console.error('Error fetching student roles:', rolesError);
          setError('Failed to load student roles');
          return;
        }

        if (!studentRoles || studentRoles.length === 0) {
          setStudents([]);
          setFeatured(getSpotlightFromStorage([]));
          return;
        }

        const studentUserIds = studentRoles.map(role => role.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', studentUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setError('Failed to load student profiles');
          return;
        }

        const transformedStudents = (profiles || []).map(transformProfileToStudent);
        setStudents(transformedStudents);
        
        // Set featured student after students are loaded
        setFeatured(getSpotlightFromStorage(transformedStudents));
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Memoized skills calculation
  const allSkills = useMemo(() => 
    Array.from(
      new Set([...students.flatMap((s) => s.skills), ...mockJobs.flatMap((j) => j.skills)])
    ), [students]
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
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
      // Clear the state to prevent it from persisting
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Reload spotlight on focus or when admin saves settings
  useEffect(() => {
    const refresh = () => {
      if (students.length > 0) {
        setFeatured(getSpotlightFromStorage(students));
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
  };

  if (role === 'student') {
    return (
      <StudentDashboard 
        jobs={jobs}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (role === 'admin') {
    return (
      <AdminDashboard 
        jobs={jobs}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
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
        {/* Featured Student Section */}
        {featured && (
          <div className="mb-12 animate-fade-in">
            <FeaturedStudent 
              student={featured}
              onViewProfile={() => navigate(`/student/${featured.id}`)}
            />
          </div>
        )}

        {/* Browse Students/Jobs Hero Section */}
        <StatsGrid 
          studentsCount={students.length}
          skillsCount={allSkills.length}
        />

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentsCount={students.length}
          jobsCount={jobs.length}
        />

        {/* Anchor for scrolling to students list */}
        <div id="students-section" />

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
          onStudentView={(id) => navigate(`/student/${id}`)}
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
