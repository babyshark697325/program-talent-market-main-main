
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { JobPosting } from "@/data/mockJobs";
import { Building, Calendar, Mail, DollarSign } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface JobCardProps {
  job: JobPosting;
  onView: () => void;
  hideBookmark?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onView, hideBookmark = false }) => {
  const { userRole } = useAuth();
  // Handle case when userRole is null
  const isClient = userRole === 'client';
  return (
    <Card className="h-[420px] w-[350px] flex flex-col hover:shadow-lg card-hover bg-background text-foreground border-border">
      <CardHeader className="p-6 pb-4 h-[200px] flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-3 h-[5.25rem] leading-tight flex items-start break-words">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground h-[1.25rem]">
              <Building size={14} className="flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
          {!isClient && !hideBookmark && <BookmarkButton jobId={job.id} className="ml-2 flex-shrink-0" />}
        </div>
        <div className="flex flex-wrap gap-2 h-[2.5rem] items-start mt-auto overflow-hidden">
          {job.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} className="bg-[hsl(var(--tag-bg))] text-[hsl(var(--tag-foreground))] text-xs px-2 py-1 whitespace-nowrap flex-shrink-0">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge className="bg-[hsl(var(--tag-bg))] text-[hsl(var(--tag-foreground))] text-xs px-2 py-1 whitespace-nowrap flex-shrink-0">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-6 py-0 h-[120px] flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 h-[4rem] leading-relaxed break-words overflow-hidden">
          {job.description}
        </p>
        
        <div className="space-y-2 text-sm mt-auto">
          <div className="flex items-center gap-2 h-[1.25rem]">
            <DollarSign size={14} className="text-primary flex-shrink-0" />
            <span className="font-medium text-primary truncate">{job.budget}</span>
          </div>
          <div className="flex items-center gap-2 h-[1.25rem]">
            <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
            <span className="truncate">{job.duration}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-4 h-[70px] flex items-center">
        <Button asChild variant="default" className="w-full !bg-[#2E7D32] !text-white shadow-none hover:brightness-95 text-center">
          <Link to={`/jobs/${job.id}`} onClick={onView}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;