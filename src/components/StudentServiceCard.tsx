import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ExternalLink, Briefcase, GraduationCap, User } from "lucide-react";
import { StudentService } from "@/types/student";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GradientAvatarFallback } from "@/components/GradientAvatarFallback";

interface StudentServiceCardProps {
  student: StudentService;
  onView?: () => void;
}

const StudentServiceCard: React.FC<StudentServiceCardProps> = ({ student, onView }) => {
  // Debug log for rendering
  (() => { console.log('[StudentServiceCard] Rendered for student:', student.cic_id); })();
  return (
    <div className="group relative rounded-xl p-[1px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.25),hsl(var(--primary)/0.08),transparent)] hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.35)] transition-shadow duration-300 h-full">
      <div className="flex flex-col h-full bg-background text-foreground border border-border/60 rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 p-5 cursor-pointer transform group-hover:-translate-y-0.5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="relative">
            <Avatar className={`w-14 h-14 border-2 flex-shrink-0 ${student.affiliation === 'alumni' ? 'border-[#D4AF37]' : 'border-primary'}`}>
              {student.avatarUrl && (
                <AvatarImage src={student.avatarUrl} alt={`${student.name} profile`} />
              )}
              <GradientAvatarFallback>
                <User className="w-6 h-6" />
              </GradientAvatarFallback>
            </Avatar>

            {student.affiliation && (
              <Badge
                variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}
                className={`absolute -bottom-1 -right-1 rounded-full text-[9px] px-1.5 py-0.5 ${student.affiliation === 'alumni' ? 'bg-[#D4AF37] text-black border border-[#D4AF37] !transition-none !hover:bg-[#D4AF37] !hover:text-black !hover:border-[#D4AF37] !scale-100' : ''}`}
              >
                {student.affiliation === 'alumni' ? 'Alumni' : 'Student'}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-lg font-bold leading-tight truncate overflow-hidden whitespace-nowrap">
              {student.name}
            </h3>

            {/* Star Rating - replaces the title text */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(student.rating ?? 5)
                    ? 'text-[#D4AF37] fill-[#D4AF37]'
                    : 'text-muted-foreground/30'
                    }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({(student.rating ?? 5).toFixed(1)})
              </span>
            </div>
          </div>
        </div>        {/* Description */}
        <div className="flex-1 mb-6 text-sm leading-relaxed text-muted-foreground">
          <div className="break-words">
            {student.description}
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(student.skills || []).slice(0, 3).map((skill) => (
            <Badge key={skill} className="text-xs px-2.5 py-1 bg-secondary/80 text-secondary-foreground border-0 whitespace-nowrap">
              {skill}
            </Badge>
          ))}
          {(student.skills || []).length > 3 && (
            <Badge className="text-xs px-2.5 py-1 bg-secondary/80 text-secondary-foreground border-0 whitespace-nowrap">
              +{(student.skills || []).length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border/50">
          <span className="font-semibold text-primary text-base whitespace-nowrap">{student.price}</span>
          <Button
            size="sm"
            onClick={() => {
              console.log('[StudentServiceCard] View button clicked for:', student.cic_id);
              if (onView) onView();
            }}
            variant="default"
            className="text-sm px-4 py-2 h-9"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}; export default StudentServiceCard;
