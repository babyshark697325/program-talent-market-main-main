import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JobPosting } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter, Heart } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const BrowseJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<"title" | "budget" | "company">("title");

  // Fetch jobs on mount - moved to bottom to avoid hoisting issues

  const fetchJobs = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*');

      if (error) throw error;

      if (data) {
        const mappedJobs: JobPosting[] = data.map((job: Job) => ({
          ...job,
          id: job.id,
          postedDate: job.posted_date,
          contactEmail: job.contact_email,
          experienceLevel: job.experience_level,
          // Handle potential missing optional fields if DB allows nulls, though our seed assumes not null
          location: job.location || 'Remote',
          requirements: job.requirements || []
        }));
        setJobs(mappedJobs);
        setFilteredJobs(mappedJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch jobs on mount - moved to bottom to avoid hoisting issues

  // Get all unique skills from jobs
  const allSkills = Array.from(
    new Set(jobs.flatMap(job => job.skills))
  ).sort();

  useEffect(() => {
    let filtered = jobs;

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

    // Only apply budget filter if there's a meaningful range set
    const minBudget = budgetRange[0];
    const maxBudget = budgetRange[1];
    if (minBudget > 0 || maxBudget < 10000) {
      filtered = filtered.filter((job) => {
        const budgetMatch = job.budget.match(/\$?(\d+(?:,\d{3})*)/);
        if (!budgetMatch) return true; // Include jobs without clear budget format
        const budget = parseInt(budgetMatch[1].replace(/,/g, ""));
        return budget >= minBudget && budget <= maxBudget;
      });
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "budget": {
          const budgetA = parseInt(a.budget.replace(/[^\d]/g, ''));
          const budgetB = parseInt(b.budget.replace(/[^\d]/g, ''));
          return budgetA - budgetB;
        }
        case "company":
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [searchQuery, selectedSkills, budgetRange, sortBy, jobs]);

  const handleJobView = (id: number) => {
    navigate(`/job/${id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setBudgetRange([0, 1000]);
  };

  // Fetch jobs on mount
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Browse Job Opportunities"
          description="Find exciting projects that match your skills and interests"
        />

        <div className="rounded-3xl p-8 shadow-md border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5 mb-10">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-36 py-6 text-lg rounded-full border border-primary/30 dark:border-white/10 focus:border-primary focus:ring-primary/20 bg-white/90 dark:bg-[#040b17] backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2"
              />
              {/* Clear Filters Button - inside search bar */}
              <button
                onClick={handleClearFilters}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm rounded-full bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md transition-all font-semibold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Clear Filters
              </button>
            </div>
          </div>          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
              Sort by:
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "title", label: "Title" },
                { value: "budget", label: "Budget" },
                { value: "company", label: "Company" }
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => setSortBy(sort.value as "title" | "budget" | "company")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${sortBy === sort.value
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25"
                    : "bg-secondary/60 text-primary border border-primary/20 hover:bg-primary/5"
                    }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
              Filter by skill:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSkills([])}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${selectedSkills.length === 0
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25"
                  : "bg-secondary/60 dark:bg-[#040b17] text-primary border border-primary/20 dark:border-white/10 hover:bg-primary/5 dark:hover:bg-white/5"
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${selectedSkills.includes(skill)
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-fade-in hover:scale-[1.02] transition-transform duration-200 flex"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <JobCard
                  job={job}
                  onView={() => handleJobView(Number(job.id))}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="rounded-3xl p-16 shadow-md border bg-white border-black/10 dark:bg-[#040b17] dark:border-white/5 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-primary/60" />
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