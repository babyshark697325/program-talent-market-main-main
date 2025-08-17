
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortAsc } from "lucide-react";

interface SearchFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  activeTab: "students" | "jobs";
  allSkills: string[];
  sortBy: "name" | "price" | "rating";
  setSortBy: (sort: "name" | "price" | "rating") => void;
  resultsCount: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  search,
  setSearch,
  selectedSkill,
  setSelectedSkill,
  activeTab,
  allSkills,
  sortBy,
  setSortBy,
  resultsCount
}) => {
  return (
    <div className="bg-secondary/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-primary/20 mb-6 md:mb-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder={`Search ${activeTab === "students" ? "students..." : "jobs..."}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 md:pl-12 py-3 md:py-4 text-base md:text-lg rounded-2xl border-primary/30 focus:border-primary focus:ring-primary/20 bg-secondary backdrop-blur-sm shadow-sm"
          />
        </div>
        
        {activeTab === "students" && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
              <SortAsc size={14} className="md:w-4 md:h-4" />
              Sort by:
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "name", label: "Name" },
                { value: "price", label: "Price" },
                { value: "rating", label: "Rating" }
              ].map((sort) => (
                <Button
                  key={sort.value}
                  variant={sortBy === sort.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(sort.value as any)}
                  className={`rounded-xl transition-all duration-200 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 ${
                    sortBy === sort.value 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-white/80 border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  {sort.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
          <Filter size={14} className="md:w-4 md:h-4" />
          Filter by skill:
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
              selectedSkill === null 
                ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25" 
                : "bg-white/90 text-primary border border-primary/30 hover:bg-primary/5"
            }`}
            onClick={() => setSelectedSkill(null)}
          >
            All Skills
          </Badge>
          {allSkills.slice(0, window.innerWidth < 640 ? 4 : 8).map((skill) => (
            <Badge
              key={skill}
              className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
                selectedSkill === skill 
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25" 
                  : "bg-white/90 text-primary border border-primary/30 hover:bg-primary/5"
              }`}
              onClick={() => setSelectedSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-primary/10">
        <p className="text-xs md:text-sm text-muted-foreground">
          Found {resultsCount} {activeTab === "students" ? "student" : "job"}{resultsCount !== 1 ? 's' : ''}
          {selectedSkill && ` with "${selectedSkill}" skill`}
          {search && ` matching "${search}"`}
        </p>
      </div>
    </div>
  );
};

export default SearchFilters;
