import React, { useState, useEffect, useMemo } from "react";
import FeaturedStudent from "@/components/FeaturedStudent";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import HeroSection from "@/components/HeroSection";
import StatsGrid from "@/components/StatsGrid";
import TabNavigation from "@/components/TabNavigation";
import SearchFilters from "@/components/SearchFilters";
import ContentGrid from "@/components/ContentGrid";
import { mockStudents } from "@/data/mockStudents";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";


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

function getSpotlightFromStorage() {
  try {
    const q = localStorage.getItem(LS_QUOTE_KEY) || "";
    const sid = localStorage.getItem(LS_STUDENT_ID_KEY);
    const img = localStorage.getItem(LS_SHOWCASE_IMAGE_KEY) || "";
    const id = sid ? Number(sid) : 1;
    const s = mockStudents.find((m) => m.id === id) || mockStudents[0];
    
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
    const s = mockStudents[0];
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
  const [featured, setFeatured] = useState(getSpotlightFromStorage());
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();

  // Memoized skills calculation
  const allSkills = useMemo(() => 
    Array.from(
      new Set([...mockStudents.flatMap((s) => s.skills), ...mockJobs.flatMap((j) => j.skills)])
    ), []
  );

  // Handle tab switching from sidebar navigation
  useEffect(() => {
    const st = location.state as { activeTab?: string; scrollTo?: string } | null;
    if (st?.activeTab) {
      setActiveTab(st.activeTab);
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
    const refresh = () => setFeatured(getSpotlightFromStorage());
    window.addEventListener('focus', refresh);
    window.addEventListener('spotlight:updated', refresh as EventListener);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('spotlight:updated', refresh as EventListener);
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const searchLower = search.toLowerCase();
    
    return mockStudents.filter((student) => {
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
  }, [search, selectedSkill, sortBy]);

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
        <div className="mb-12 animate-fade-in">
          <FeaturedStudent 
            student={featured}
            onViewProfile={() => navigate(`/student/${featured.id}`)}
          />
        </div>

        {/* Browse Students/Jobs Hero Section */}
        <StatsGrid 
          studentsCount={mockStudents.length}
          skillsCount={allSkills.length}
        />

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentsCount={mockStudents.length}
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
