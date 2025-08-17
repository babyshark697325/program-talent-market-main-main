
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, Sparkles } from "lucide-react";

interface FeaturedStudentProps {
  student: {
    id: number;
    name: string;
    title: string;
    avatarUrl: string;
    skills: string[];
    quote: string;
    showcaseImage?: string;
    showcaseOrientation?: 'landscape' | 'portrait';
    clientReview: {
      text: string;
      clientName: string;
      rating: number;
    };
  };
  onViewProfile: () => void;
}

const FeaturedStudent: React.FC<FeaturedStudentProps> = ({ student, onViewProfile }) => {
  return (
    <div className="group relative rounded-3xl p-[1px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.35),hsl(var(--primary)/0.1),transparent)] shadow-[0_0_30px_-12px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_45px_-10px_hsl(var(--primary)/0.35)] transition-shadow duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-background border border-border/60 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.01] transform group-hover:-translate-y-0.5">
        
        <div className="relative z-10 p-4 md:p-8">
          {/* Enhanced Header */}
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-muted text-foreground px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-lg border border-border">
              <Star size={14} className="md:w-[18px] md:h-[18px] text-primary fill-current animate-pulse" />
              <span className="hidden sm:inline">Featured Student of the Week</span>
              <span className="sm:hidden">Featured Student</span>
              <Star size={12} className="md:w-4 md:h-4 text-primary animate-pulse fill-current" style={{ animationDelay: '1s' }} />
            </div>
            <h3 className="text-xl md:text-3xl font-black text-foreground mb-2 md:mb-3 leading-relaxed pb-2">
              Spotlight Success
            </h3>
            <p className="text-muted-foreground font-medium text-sm md:text-lg">Celebrating excellence in our community</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Enhanced Student Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="relative group">
                  
                  <img
                    src={student.avatarUrl}
                    alt={`${student.name} profile`}
                    className="relative w-20 md:w-24 h-20 md:h-24 rounded-full object-cover border-4 border-[#C7A836] shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-primary text-primary-foreground rounded-full p-1.5 md:p-2 shadow-lg animate-pulse">
                    <Star size={12} className="md:w-[14px] md:h-[14px] fill-current" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">
                    {student.name}
                  </h4>
                  <p className="text-muted-foreground font-semibold text-base md:text-lg">{student.title}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                {student.skills.map((skill, index) => (
                  <Badge 
                    key={skill} 
                    className="bg-[hsl(var(--tag-bg))] text-[hsl(var(--tag-foreground))] px-4 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <Button 
                onClick={onViewProfile}
                variant="default"
                className="mb-4 px-8 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                View Full Profile
              </Button>

              {/* Enhanced Student Quote */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 mb-6 relative shadow-lg border border-primary/10 hover:shadow-xl transition-all duration-300">
                <Quote size={20} className="text-primary/50 absolute top-4 left-4" />
                <p className="text-card-foreground italic pl-8 pr-4 font-medium leading-relaxed">
                  "{student.quote}"
                </p>
                <div className="absolute bottom-2 right-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>

                        </div>

            {/* Showcase Work (optional) */}
            {student.showcaseImage && (
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-0 shadow-xl border border-primary/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative w-full aspect-video md:aspect-[4/3]">
                  <img
                    src={student.showcaseImage}
                    alt="Showcase Work"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold shadow-sm border border-border bg-white/90 text-foreground dark:bg-background/70 dark:text-foreground backdrop-blur">
                      Showcase Work
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Client Review (full width below both columns) */}
            <div className="md:col-span-2 bg-card/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="mb-6">
                <h5 className="font-bold text-card-foreground mb-3 text-lg">Recent Client Review</h5>
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`transition-all duration-300 ${
                        i < student.clientReview.rating
                          ? "text-primary fill-current animate-pulse"
                          : "text-muted-foreground"
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2 font-semibold">
                    ({student.clientReview.rating}.0)
                  </span>
                </div>
              </div>
              
              <blockquote className="text-card-foreground mb-6 leading-relaxed font-medium text-lg">
                "{student.clientReview.text}"
              </blockquote>
              
              <cite className="text-sm font-bold text-foreground">
                — {student.clientReview.clientName}
              </cite>
              
              {/* Decorative element */}
              <div className="mt-4 flex justify-end">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStudent;
