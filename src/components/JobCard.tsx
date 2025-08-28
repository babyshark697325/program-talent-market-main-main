
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
    <Card className="h-[380px] w-full flex flex-col hover:shadow-lg card-hover bg-background text-foreground border-border">
      <CardHeader className="p-4 pb-3 h-[115px] flex flex-col">
        <div className="flex items-start justify-between mb-3 h-[75px]">
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <div className="min-h-[55px] flex items-start">
              <h3 className="font-semibold text-xl leading-6 line-clamp-2">{job.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground h-[20px] mt-auto">
              <Building size={14} className="flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
          {!isClient && !hideBookmark && <BookmarkButton jobId={job.id} className="ml-2 flex-shrink-0" />}
        </div>
        <div className="flex flex-wrap gap-2 items-start h-[2rem] overflow-hidden">
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
      
      <CardContent className="flex-1 px-4 py-0 flex flex-col h-[200px]">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed break-words overflow-hidden flex-1">
          {job.description}
        </p>
        
        <div className="space-y-2 text-sm mt-auto h-[60px] flex flex-col justify-end">
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
      
      <CardFooter className="p-4 pt-3 h-[80px] flex items-center">
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