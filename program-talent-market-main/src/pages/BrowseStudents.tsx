import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, MapPin, Clock, DollarSign, SortAsc } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockStudents, StudentService } from "@/data/mockStudents";
import StudentServiceCard from "@/components/StudentServiceCard";
import PageHeader from '@/components/PageHeader';

const BrowseStudents = () => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, []);
  const [filteredStudents, setFilteredStudents] = useState<StudentService[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");

  // Get all unique skills from students
  const allSkills = Array.from(
    new Set(mockStudents.flatMap(student => student.skills))
  ).sort();

  useEffect(() => {
    let filtered = mockStudents;

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((student) =>
        selectedSkills.some((skill) => student.skills.includes(skill))
      );
    }

    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    filtered = filtered.filter((student) => {
      const price = parseInt(student.price.replace(/[^0-9]/g, ""));
      return price >= minPrice && price <= maxPrice;
    });

    // Apply sorting
    filtered = filtered.sort((a, b) => {
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

    setFilteredStudents(filtered);
  }, [searchQuery, selectedSkills, priceRange, sortBy]);

  const handleStudentView = (id: number) => {
    navigate(`/student/${id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setPriceRange([0, 200]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Browse Talented Students" 
        description="Discover skilled students ready to help with your projects"
      />

        <div className="rounded-3xl p-8 shadow-xl border mb-10 bg-white/70 dark:bg-[#040b17] border-primary/20 dark:border-white/10">
          <div className="flex flex-col lg:flex-row gap-6 mb-6 relative">
            {/* Clear Filters Button - top right */}
            <button
              onClick={handleClearFilters}
              className="absolute right-0 top-0 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all text-sm font-semibold z-10"
              style={{ margin: '1rem' }}
            >
              Clear Filters
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search students by name, skill, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-4 text-lg rounded-2xl border border-primary/30 dark:border-white/10ocus:border-primary focus:ring-primary/20 bg-white/90 dark:bg-[#040b17] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
              Sort by:
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "name", label: "Name" },
                { value: "price", label: "Price" },
                { value: "rating", label: "Rating" }
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => setSortBy(sort.value as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                    sortBy === sort.value 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25" 
                      : "bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5"
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
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25" 
                    : "bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5"
                }`}
              >
                All Skills
              </button>
              {allSkills.slice(0, 8).map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    if (selectedSkills.includes(skill)) {
                      setSelectedSkills(selectedSkills.filter(s => s !== skill));
                    } else {
                      setSelectedSkills([...selectedSkills, skill]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                    selectedSkills.includes(skill)
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25" 
                      : "bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredStudents.map((student, index) => (
              <div 
                key={student.id} 
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <StudentServiceCard
                  student={student}
                  onView={() => handleStudentView(student.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="rounded-3xl p-16 shadow-xl border max-w-lg mx-auto bg-white/70 dark:bg-[#040b17] border-primary/20 dark:border-white/10">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Students Found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any students matching your criteria. 
                Try adjusting your search or filters.
              </p>
              <button 
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default BrowseStudents;
