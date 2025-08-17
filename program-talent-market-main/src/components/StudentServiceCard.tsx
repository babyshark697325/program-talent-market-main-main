
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentService } from "@/data/mockStudents";

interface Props {
  student: StudentService;
  onView?: () => void;
}

const StudentServiceCard: React.FC<Props> = ({ student, onView }) => (
  <div className="group relative rounded-xl p-[1px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.25),hsl(var(--primary)/0.08),transparent)] hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.35)] transition-shadow duration-300 h-full">
    <div className="flex flex-col h-full bg-background text-foreground border border-border/60 rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 p-4 md:p-6 cursor-pointer transform group-hover:-translate-y-0.5">
      {/* header */}
<div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 mb-4 text-center sm:text-left">
  <img
  src={student.avatarUrl}
  alt={`${student.name} profile`}
  className="w-14 md:w-16 h-14 md:h-16 rounded-full object-cover border-2 border-[#C7A836] flex-shrink-0"
  />

  <div className="flex-1 min-w-0">
    {/* allow wrapping in this row */}
    <div className="flex items-start gap-2 flex-wrap">
      {/* NAME: wrap to 2 lines, no truncate */}
      <h3 className="text-base md:text-lg font-semibold leading-snug break-words whitespace-normal line-clamp-2">
        {student.name}
      </h3>

      {student.affiliation && (
        <Badge
          variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}
          className={`rounded-full text-[10px] px-2 py-0.5 shrink-0 ${student.affiliation === 'alumni' ? 'bg-[#D4AF37] text-black border border-[#D4AF37] !transition-none !hover:bg-[#D4AF37] !hover:text-black !hover:border-[#D4AF37] !scale-100' : ''}`}
        >
          {student.affiliation === 'alumni' ? 'MyVillage Alumni' : 'MyVillage Student'}
        </Badge>
      )}
    </div>

    <div className="text-sm text-muted-foreground break-words whitespace-normal line-clamp-2 md:line-clamp-none">
    {student.title}
    </div>
  </div>
</div>

      {/* body fills available space */}
      <div className="flex-1 mb-4 text-sm md:text-[15px] text-muted-foreground line-clamp-3 md:line-clamp-4">
        {student.description}
      </div>

      {/* tags */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
        {student.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} className="bg-[hsl(var(--tag-bg))] text-[hsl(var(--tag-foreground))] px-2 md:px-3 py-1 text-xs rounded-lg !transition-none !hover:bg-[hsl(var(--tag-bg))] !hover:text-[hsl(var(--tag-foreground))] !hover:border-none !scale-100">
            {skill}
          </Badge>
        ))}
        {student.skills.length > 3 && (
          <Badge className="bg-[hsl(var(--tag-bg))] text-[hsl(var(--tag-foreground))] px-2 md:px-3 py-1 text-xs rounded-lg !transition-none !hover:bg-[hsl(var(--tag-bg))] !hover:text-[hsl(var(--tag-foreground))] !hover:border-none !scale-100">
            +{student.skills.length - 3}
          </Badge>
        )}
      </div>

      {/* footer pinned to bottom */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="font-medium text-primary text-sm md:text-base">{student.price}</span>

        {/* If you want solid gold, add the className override below */}
        <Button
          size="sm"
          onClick={onView}
          variant="default"
          // uncomment to force solid gold & remove glow:
          // className="!bg-[var(--gold)] !text-black shadow-none hover:shadow-none"
        >
          View Details
        </Button>
      </div>
    </div>
  </div>
);

export default StudentServiceCard;
