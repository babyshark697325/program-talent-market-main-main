
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter, Heart } from "lucide-react";

const BrowseJobs = () => {
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 1000]);

  // Get all unique skills from jobs
  const allSkills = Array.from(
    new Set(mockJobs.flatMap(job => job.skills))
  ).sort();

  useEffect(() => {
    let filtered = mockJobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((job) =>
        selectedSkills.some((skill) => job.skills.includes(skill))
      );
    }

    const minBudget = budgetRange[0];
    const maxBudget = budgetRange[1];
    filtered = filtered.filter((job) => {
      const budget = parseInt(job.budget.replace(/[^0-9]/g, ""));
      return budget >= minBudget && budget <= maxBudget;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, selectedSkills, budgetRange]);

  const handleJobView = (id: number) => {
    navigate(`/job/${id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setBudgetRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">
            Browse Job Opportunities
          </h1>
          <p className="text-muted-foreground text-lg">
            Find exciting projects that match your skills and interests
          </p>
        </div>

  <div className="bg-white/70 dark:bg-[#040b17] backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-primary/20 dark:border-white/10 mb-10">
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, company, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border border-primary/30 dark:border-white/10 focus:border-primary focus:ring-primary/20 bg-white/90 dark:bg-[#040b17] backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
              Filter by skill:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSkills([])}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                  selectedSkills.length === 0 
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25" 
                    : "bg-white/90 dark:bg-[#040b17] text-primary border border-primary/30 dark:border-white/10 hover:bg-primary/5 dark:hover:bg-white/5"
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
                      : "bg-white/90 dark:bg-[#040b17] text-primary border border-primary/30 dark:border-white/10 hover:bg-primary/5 dark:hover:bg-white/5"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-primary/10">
            <p className="text-sm text-muted-foreground">
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              {selectedSkills.length > 0 && ` with selected skills`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
          </h2>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <JobCard
                  job={job}
                  onView={() => handleJobView(job.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/70 dark:bg-[#040b17] backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 dark:border-white/10 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Jobs Found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any jobs matching your criteria. 
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
    </div>
  );
};

export default BrowseJobs;
