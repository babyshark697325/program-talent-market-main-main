
import React from "react";
import { Users } from "lucide-react";

interface StatsGridProps {
  studentsCount: number;
  skillsCount: number;
  averageRating?: number | null;
  responseTimeHours?: number | null;
}

const StatsGrid: React.FC<StatsGridProps> = ({ studentsCount, skillsCount, averageRating, responseTimeHours }) => {
  const ratingDisplay = typeof averageRating === 'number' && !isNaN(averageRating)
    ? `${averageRating.toFixed(1)}★`
    : '0.0★';
  const responseDisplay = typeof responseTimeHours === 'number' && !isNaN(responseTimeHours)
    ? `${Math.max(0, responseTimeHours).toFixed(responseTimeHours % 1 ? 1 : 0)}h`
    : '24h';
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-background py-14 px-6 md:px-12 animate-fade-in shadow-xl border border-border">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10" aria-hidden="true"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-muted rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
            <Users className="text-primary" size={32} />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-foreground leading-[1.2] pb-2 md:pb-4 overflow-visible">
          Discover Amazing Talent
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 leading-[1.6] pb-1 md:pb-2 overflow-visible px-4">
          Connect with skilled students ready to bring your projects to life
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-center">
          <div className="bg-card/60 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm border border-primary/10">
            <div className="text-lg md:text-2xl font-bold text-primary">{studentsCount}+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Talented Students</div>
          </div>
          <div className="bg-card/60 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm border border-primary/10">
            <div className="text-lg md:text-2xl font-bold text-primary">{skillsCount}+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Skills Available</div>
          </div>
          <div className="bg-card/60 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm border border-primary/10">
            <div className="text-lg md:text-2xl font-bold text-primary">{ratingDisplay}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="bg-card/60 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm border border-primary/10">
            <div className="text-lg md:text-2xl font-bold text-primary">{responseDisplay}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
