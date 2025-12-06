import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Filter, MapPin, Star, ExternalLink, Briefcase, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentServiceCard from "@/components/StudentServiceCard";
import PageHeader from '@/components/PageHeader';
import { StudentService } from '@/types/student';
import { supabase } from "@/integrations/supabase/client";

// Updated interface to match the profiles table structure
export interface PrelaunchStudent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  city?: string;
  role: string;
  created_at: string;
  status?: string;
  cic_id?: string;
}

// Transform database profile to component format
const transformStudent = (dbStudent: PrelaunchStudent): StudentService => {
  let displayName = '';
  if (dbStudent.first_name && dbStudent.last_name) {
    displayName = `${dbStudent.first_name} ${dbStudent.last_name}`;
  } else if (dbStudent.first_name) {
    displayName = dbStudent.first_name;
  } else if (dbStudent.last_name) {
    displayName = dbStudent.last_name;
  } else if (dbStudent.email) {
    displayName = dbStudent.email.split('@')[0];
  } else {
    displayName = 'Unnamed Student';
  }
  return {
    id: parseInt(dbStudent.id.slice(-8), 16),
    cic_id: dbStudent.cic_id || dbStudent.id,
    name: displayName,
    title: 'Student',
    description: 'Prelaunch signup student',
    avatarUrl: '',
    skills: [],
    price: '$25/hr',
    affiliation: 'student',
    aboutMe: '',
    contact: {
      email: dbStudent.email,
      phone: undefined,
      linkedinUrl: undefined,
      githubUrl: undefined,
      upworkUrl: undefined,
      fiverrUrl: undefined,
    },
    portfolio: [],
  };
};

const BrowseStudents = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const [students, setStudents] = useState<StudentService[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');

  // Fetch students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('prelaunch_signups')
          .select('*')
          .eq('role', 'student');
        console.log('Supabase prelaunch students data:', data);
        if (error || !data) {
          setError('Failed to load students. Please try again.');
          setStudents([]);
          setFilteredStudents([]);
        } else {
          const mappedStudents = data.map(transformStudent);
          setStudents(mappedStudents);
          setFilteredStudents(mappedStudents);
        }
      } catch (err) {
        console.error('Error loading students:', err);
        setError('Failed to load students. Please try again.');
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Get all unique skills from students
  const allSkills = Array.from(new Set(students.flatMap((student) => student.skills || []))).sort();

  useEffect(() => {
    let filtered = students;

    // Only apply filters if there is a search query or selected skills
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (student.skills || []).some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((student) =>
        selectedSkills.some((skill) => (student.skills || []).includes(skill))
      );
    }

    // Only apply price filter if a search or skill filter is active
    if (searchQuery || selectedSkills.length > 0) {
      const [minPrice, maxPrice] = priceRange;
      filtered = filtered.filter((student) => {
        const price = parseInt(student.price.replace(/[^0-9]/g, ''), 10);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply sorting without mutating original array/state
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price': {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);
          return priceA - priceB;
        }
        case 'rating':
          // Placeholder: sort by name until rating is available on StudentService
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredStudents(sorted);
  }, [students, searchQuery, selectedSkills, priceRange, sortBy]);

  const handleStudentView = (cic_id: string) => {
  console.log('[BrowseStudents] handleStudentView called for:', cic_id);
  navigate(`/view-student/${cic_id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setPriceRange([0, 200]);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader title="Browse Talented Students" description="Discover skilled students ready to help with your projects" />
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader title="Browse Talented Students" description="Discover skilled students ready to help with your projects" />
        <div className="text-center py-20">
          <div className="rounded-3xl p-16 shadow-md border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5 max-w-lg mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Students</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Browse Talented Students" description="Discover skilled students ready to help with your projects" />

      <div className="rounded-3xl p-8 shadow-md border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5 mb-10">
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search students by name, skill, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-36 py-6 text-lg rounded-full border border-primary/30 dark:border-white/10 focus:border-primary focus:ring-primary/20 bg-white/90 dark:bg-[#040b17] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2"
            />
            {/* Clear Filters Button - inside search bar */}
            <button
              onClick={handleClearFilters}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm rounded-full bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md transition-all font-semibold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
            Sort by:
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'name', label: 'Name' },
              { value: 'price', label: 'Price' },
              { value: 'rating', label: 'Rating' },
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => setSortBy(sort.value as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                  sortBy === sort.value
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25'
                    : 'bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
            Filter by skill:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSkills([])}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                selectedSkills.length === 0
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25'
                  : 'bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5'
              }`}
            >
              All Skills
            </button>
            {allSkills.slice(0, 8).map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  if (selectedSkills.includes(skill)) {
                    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                  } else {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                  selectedSkills.includes(skill)
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25'
                    : 'bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-primary/10">
          <p className="text-sm text-muted-foreground">
            Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            {selectedSkills.length > 0 && ` with selected skills`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''} Available
        </h2>
      </div>

      {filteredStudents.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-start">
          {filteredStudents.map((student, index) => (
            <div
              key={student.cic_id}
              className="animate-fade-in hover:scale-[1.02] transition-transform duration-200 h-full"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <StudentServiceCard student={student} onView={() => handleStudentView(student.cic_id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="rounded-3xl p-16 shadow-md border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5 max-w-lg mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-4xl text-primary" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">No Students Found</h3>
            <p className="text-muted-foreground mb-6">
              {students.length === 0
                ? 'No students have signed up yet. Be the first to join!'
                : "We couldn't find any students matching your criteria. Try adjusting your search or filters."}
            </p>
            {students.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default BrowseStudents;
