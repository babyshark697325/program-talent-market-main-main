
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Plus } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";

interface TabNavigationProps {
  activeTab: "students" | "jobs";
  setActiveTab: (tab: "students" | "jobs") => void;
  studentsCount: number;
  jobsCount: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  studentsCount,
  jobsCount,
}) => {
  const { role } = useRole();
  const navigate = useNavigate();

  const handleStudentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Students tab clicked, current activeTab:", activeTab);
    setActiveTab("students");
  };

  const handleJobsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Jobs tab clicked, current activeTab:", activeTab);
    setActiveTab("jobs");
  };

  const handlePostJobClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/post-job");
  };

  return (
    <div className="flex flex-col sm:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <button
          type="button"
          onClick={handleStudentsClick}
          className={`flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm md:text-base ${
            activeTab === "students" 
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-primary/25" 
              : "bg-secondary/60 backdrop-blur-sm border border-primary/20 hover:bg-primary/10 text-foreground"
          }`}
        >
          <Users size={16} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline">Students ({studentsCount})</span>
          <span className="sm:hidden">Students</span>
        </button>
        <button
          type="button"
          onClick={handleJobsClick}
          className={`flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm md:text-base ${
            activeTab === "jobs" 
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-primary/25" 
              : "bg-secondary/60 backdrop-blur-sm border border-primary/20 hover:bg-primary/10 text-foreground"
          }`}
        >
          <Briefcase size={16} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline">Jobs ({jobsCount})</span>
          <span className="sm:hidden">Jobs</span>
        </button>
      </div>
      
      {role === 'client' && (
        <Button 
          type="button"
          onClick={handlePostJobClick}
          className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto"
        >
          <Plus size={16} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline">Post a Job</span>
          <span className="sm:hidden">Post Job</span>
        </Button>
      )}
    </div>
  );
};

export default TabNavigation;
