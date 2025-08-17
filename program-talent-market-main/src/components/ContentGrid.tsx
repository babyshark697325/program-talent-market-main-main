
import React from "react";
import { Button } from "@/components/ui/button";
import StudentServiceCard from "@/components/StudentServiceCard";
import JobCard from "@/components/JobCard";
import { Users, Briefcase } from "lucide-react";
import { StudentService } from "@/data/mockStudents";
import { JobPosting } from "@/data/mockJobs";

interface ContentGridProps {
  activeTab: "students" | "jobs";
  filteredStudents: StudentService[];
  filteredJobs: JobPosting[];
  onStudentView: (id: number) => void;
  onJobView: (id: number) => void;
  onClearFilters: () => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  activeTab,
  filteredStudents,
  filteredJobs,
  onStudentView,
  onJobView,
  onClearFilters
}) => {
  const renderEmptyState = (type: "students" | "jobs") => (
    <div className="text-center py-20">
      <div className="bg-card/70 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-primary/20 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          {type === "students" ? (
            <Users className="text-primary/40" size={48} />
          ) : (
            <Briefcase className="text-primary/40" size={48} />
          )}
        </div>
        <h3 className="text-2xl font-bold text-primary mb-4">
          No {type === "students" ? "Students" : "Jobs"} Found
        </h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any {type === "students" ? "students" : "job postings"} matching your criteria. 
          Try adjusting your search or filters.
        </p>
        <Button 
          onClick={onClearFilters}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {activeTab === "students" ? (
        filteredStudents.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {filteredStudents.map((student, index) => (
              <div 
                key={student.id} 
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <StudentServiceCard
                  student={student}
                  onView={() => onStudentView(student.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState("students")
        )
      ) : (
        filteredJobs.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {filteredJobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <JobCard
                  job={job}
                  onView={() => onJobView(job.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState("jobs")
        )
      )}
    </div>
  );
};

export default ContentGrid;
