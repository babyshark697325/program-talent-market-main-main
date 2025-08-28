
import React from "react";
import { Sparkles, Star, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background - Day/Night */}
      {isDark ? (
        // Night theme - Deep blues to purple gradient
        <>
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(to top, #0f172a 0%, #1e293b 15%, #334155 30%, #475569 50%, #1e1b4b 75%, #312e81 100%)'
          }}></div>
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 20%, rgba(51, 65, 85, 0.4) 40%, rgba(71, 85, 105, 0.3) 60%, rgba(30, 27, 75, 0.2) 80%, rgba(49, 46, 129, 0.1) 100%)'
          }}></div>
        </>
      ) : (
        // Day theme - Original sunset colors
        <>
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(to top, #fbbf24 0%, #f59e0b 15%, #fb923c 30%, #fde68a 50%, #f3e8ff 75%, #faf5ff 100%)'
          }}></div>
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(to top, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.3) 20%, rgba(251, 146, 60, 0.25) 40%, rgba(253, 230, 138, 0.2) 60%, rgba(243, 232, 255, 0.15) 80%, rgba(250, 245, 255, 0.1) 100%)'
          }}></div>
        </>
      )}
      
      {/* Dynamic Organic Shapes - Day/Night */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark ? (
          // Night theme - Starlike and cloud shapes
          <>
            <div className="absolute top-20 left-10 w-2 h-2 bg-slate-200 rounded-full animate-pulse opacity-80"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-blue-200 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-200 rounded-full animate-pulse opacity-70" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-60 left-1/3 w-1 h-1 bg-indigo-200 rounded-full animate-pulse opacity-50" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-60 right-1/4 w-2 h-2 bg-slate-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '4s' }}></div>
            
            {/* Flowing night cloud shapes */}
            <div className="absolute bottom-1/3 left-1/4 w-40 h-16 bg-gradient-to-r from-slate-600/20 via-slate-500/15 to-transparent blur-md animate-pulse transform rotate-12 opacity-40" style={{ borderRadius: '100% 0% 100% 0% / 50% 50% 50% 50%', animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 right-16 w-36 h-20 bg-gradient-to-l from-slate-700/15 via-slate-600/20 to-transparent blur-lg animate-pulse transform -rotate-6 opacity-30" style={{ borderRadius: '0% 100% 0% 100% / 50% 50% 50% 50%', animationDelay: '2.5s' }}></div>
          </>
        ) : (
          // Day theme - Original sunset shapes
          <>
            <div className="absolute top-20 left-10 w-32 h-24 bg-gradient-to-br from-amber-200/4 to-rose-200/3 rounded-full blur-3xl animate-pulse transform rotate-12" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
            <div className="absolute top-40 right-20 w-28 h-36 bg-gradient-to-tr from-peach-200/3 to-lavender-200/2 blur-2xl animate-pulse" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-bl from-orange-200/15 to-pink-200/8 rounded-full blur-md animate-pulse" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', animationDelay: '2s' }}></div>
            <div className="absolute top-60 left-1/3 w-16 h-24 bg-gradient-to-r from-rose-200/10 to-amber-200/6 blur-sm animate-pulse transform -rotate-12" style={{ borderRadius: '50% 50% 80% 20% / 60% 40% 60% 40%', animationDelay: '3s' }}></div>
            <div className="absolute bottom-60 right-1/4 w-24 h-18 bg-gradient-to-tl from-purple-200/8 to-orange-200/12 blur-lg animate-pulse transform rotate-45" style={{ borderRadius: '70% 30% 50% 50% / 30% 70% 30% 70%', animationDelay: '4s' }}></div>
            
            {/* Flowing sunset wave shapes */}
            <div className="absolute bottom-1/3 left-1/4 w-40 h-16 bg-gradient-to-r from-amber-200/8 via-rose-200/12 to-transparent blur-md animate-pulse transform rotate-12" style={{ borderRadius: '100% 0% 100% 0% / 50% 50% 50% 50%', animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 right-16 w-36 h-20 bg-gradient-to-l from-pink-200/6 via-orange-200/10 to-transparent blur-lg animate-pulse transform -rotate-6" style={{ borderRadius: '0% 100% 0% 100% / 50% 50% 50% 50%', animationDelay: '2.5s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-28 h-12 bg-gradient-to-br from-purple-200/8 to-amber-200/6 blur-sm animate-pulse" style={{ borderRadius: '80% 20% 60% 40% / 30% 70% 30% 70%', animationDelay: '3.5s' }}></div>
            <div className="absolute bottom-1/4 left-20 w-32 h-28 bg-gradient-to-tr from-rose-200/10 to-orange-200/8 blur-md animate-pulse transform rotate-30" style={{ borderRadius: '40% 60% 80% 20% / 70% 30% 70% 30%', animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 left-1/2 w-24 h-32 bg-gradient-to-t from-amber-200/6 via-pink-200/10 to-transparent blur-lg animate-pulse transform -rotate-15" style={{ borderRadius: '50% 50% 20% 80% / 60% 40% 60% 40%', animationDelay: '4s' }}></div>
            <div className="absolute bottom-32 right-1/5 w-30 h-20 bg-gradient-to-bl from-purple-200/6 to-orange-200/8 blur-md animate-pulse transform rotate-18" style={{ borderRadius: '70% 30% 30% 70% / 50% 50% 50% 50%', animationDelay: '0.8s' }}></div>
          </>
        )}
      </div>
      
      {/* Dynamic Horizon Line with City Silhouette */}
      <div className="absolute -bottom-10 left-0 w-screen h-40 pointer-events-none z-10">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path d="M0,160 L0,100 L100,95 L180,85 L250,90 L320,80 L400,75 L480,85 L560,80 L640,70 L720,75 L800,65 L880,70 L960,60 L1040,65 L1120,55 L1200,60 L1200,160 Z" 
                fill={isDark ? "url(#nightSkylineGradient)" : "url(#skylineGradient)"} opacity="0.2"/>
          <path d="M0,100 L100,95 L180,85 L250,90 L320,80 L400,75 L480,85 L560,80 L640,70 L720,75 L800,65 L880,70 L960,60 L1040,65 L1120,55 L1200,60" 
                stroke={isDark ? "url(#nightRimLightGradient)" : "url(#rimLightGradient)"} strokeWidth="2" fill="none" opacity="0.6"/>
          <defs>
            {isDark ? (
              <>
                <linearGradient id="nightSkylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="nightRimLightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4"/>
                  <stop offset="30%" stopColor="#cbd5e1" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#f1f5f9" stopOpacity="0.5"/>
                  <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.4"/>
                </linearGradient>
              </>
            ) : (
              <>
                <linearGradient id="skylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#111827" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="rimLightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
                  <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#fde68a" stopOpacity="0.9"/>
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8"/>
                </linearGradient>
              </>
            )}
          </defs>
        </svg>
        
        {/* Distant hills */}
        <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1200 96" preserveAspectRatio="none">
          <path d="M0,96 L0,55 L200,50 L400,45 L600,50 L800,40 L1000,45 L1200,35 L1200,96 Z" 
                fill={isDark ? "url(#nightHillsGradient)" : "url(#hillsGradient)"} opacity="0.15"/>
          <path d="M0,55 L200,50 L400,45 L600,50 L800,40 L1000,45 L1200,35" 
                stroke={isDark ? "url(#nightDistantRimGradient)" : "url(#distantRimGradient)"} strokeWidth="1.5" fill="none" opacity="0.4"/>
          <defs>
            {isDark ? (
              <>
                <linearGradient id="nightHillsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="nightDistantRimGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.3"/>
                </linearGradient>
              </>
            ) : (
              <>
                <linearGradient id="hillsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#374151" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="distantRimGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5"/>
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#fde68a" stopOpacity="0.5"/>
                </linearGradient>
              </>
            )}
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 min-h-[70vh] md:min-h-[80vh] flex items-center justify-center py-8 md:py-16">
        <div className="text-center overflow-visible">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            {/* Dynamic Celestial Body */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {isDark ? (
                // Moon for dark mode
                <div className="w-80 h-80 bg-gradient-to-br from-slate-200/60 via-slate-300/40 to-slate-200/30 rounded-full animate-pulse" style={{ 
                  background: 'radial-gradient(circle at 30% 30%, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.6) 40%, rgba(203, 213, 225, 0.4) 70%, rgba(148, 163, 184, 0.2) 100%)',
                  boxShadow: 'inset -20px -20px 60px rgba(148, 163, 184, 0.3), 0 0 80px rgba(226, 232, 240, 0.2)'
                }}></div>
              ) : (
                // Sun for light mode
                <div className="w-80 h-80 bg-gradient-to-r from-amber-300/40 via-orange-300/30 to-amber-300/40 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(252, 211, 77, 0.4) 0%, rgba(251, 146, 60, 0.3) 50%, transparent 100%)' }}></div>
              )}
            </div>
            
            {/* Dynamic Rays/Stars */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {isDark ? (
                // Stars for dark mode
                <div>
                  <Star size={16} className="absolute -top-40 -left-20 text-slate-200/60 animate-pulse" />
                  <Star size={12} className="absolute -top-32 left-40 text-blue-200/50 animate-pulse" style={{ animationDelay: '1s' }} />
                  <Star size={14} className="absolute top-20 -right-32 text-purple-200/40 animate-pulse" style={{ animationDelay: '2s' }} />
                  <Star size={10} className="absolute -bottom-20 -left-40 text-slate-300/70 animate-pulse" style={{ animationDelay: '3s' }} />
                  <Star size={18} className="absolute bottom-32 right-20 text-indigo-200/50 animate-pulse" style={{ animationDelay: '4s' }} />
                </div>
              ) : (
                // Sun rays for light mode
                <>
                  <div className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-amber-200/30 to-transparent rotate-0 -translate-y-16"></div>
                  <div className="absolute w-1 h-28 bg-gradient-to-t from-transparent via-orange-200/25 to-transparent rotate-45 -translate-y-14"></div>
                  <div className="absolute w-1 h-24 bg-gradient-to-t from-transparent via-amber-200/20 to-transparent rotate-90 -translate-y-12"></div>
                  <div className="absolute w-1 h-28 bg-gradient-to-t from-transparent via-rose-200/25 to-transparent rotate-135 -translate-y-14"></div>
                  <div className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-amber-200/30 to-transparent rotate-180 -translate-y-16"></div>
                  <div className="absolute w-1 h-28 bg-gradient-to-t from-transparent via-orange-200/25 to-transparent rotate-225 -translate-y-14"></div>
                  <div className="absolute w-1 h-24 bg-gradient-to-t from-transparent via-amber-200/20 to-transparent rotate-270 -translate-y-12"></div>
                  <div className="absolute w-1 h-28 bg-gradient-to-t from-transparent via-rose-200/25 to-transparent rotate-315 -translate-y-14"></div>
                </>
              )}
            </div>
            
            {/* Sparkles effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles size={300} className={isDark ? "text-slate-300/30 animate-pulse" : "text-amber-300/20 animate-pulse"} />
            </div>
          </div>
          
          {/* Dynamic Celestial Body with Glow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 pointer-events-none z-0">
            {isDark ? (
              // Moon with crater effects
              <>
                <div className="absolute w-[500px] h-[500px] -top-12 -left-12 rounded-full opacity-20 blur-3xl" style={{ 
                  background: 'radial-gradient(circle, #e2e8f0 0%, #cbd5e1 40%, transparent 70%)'
                }}></div>
                <div className="w-96 h-96 rounded-full opacity-40 relative" style={{ 
                  background: 'radial-gradient(circle at 35% 35%, #f1f5f9 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
                  boxShadow: 'inset -15px -15px 40px rgba(100, 116, 139, 0.4)'
                }}>
                  {/* Moon craters */}
                  <div className="absolute top-12 left-20 w-8 h-8 bg-slate-400/30 rounded-full"></div>
                  <div className="absolute top-32 right-16 w-6 h-6 bg-slate-500/25 rounded-full"></div>
                  <div className="absolute bottom-20 left-24 w-10 h-10 bg-slate-400/20 rounded-full"></div>
                </div>
              </>
            ) : (
              // Sun with original styling
              <>
                <div className="absolute w-[500px] h-[500px] -top-12 -left-12 rounded-full opacity-15 blur-3xl" style={{ 
                  background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 40%, transparent 70%)'
                }}></div>
                <div className="w-96 h-96 rounded-full opacity-30" style={{ 
                  background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 30%, #dc2626 60%, #7c2d12 100%)'
                }}></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                  <div className="w-1 h-20 bg-gradient-to-t from-amber-300/20 to-transparent blur-sm"></div>
                </div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-8 rotate-15">
                  <div className="w-0.5 h-16 bg-gradient-to-t from-orange-300/15 to-transparent blur-sm"></div>
                </div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-8 -rotate-15">
                  <div className="w-0.5 h-16 bg-gradient-to-t from-amber-300/15 to-transparent blur-sm"></div>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-8 rotate-30">
                  <div className="w-0.5 h-12 bg-gradient-to-t from-rose-300/10 to-transparent blur-sm"></div>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-8 -rotate-30">
                  <div className="w-0.5 h-12 bg-gradient-to-t from-orange-300/10 to-transparent blur-sm"></div>
                </div>
              </>
            )}
          </div>
          
          <div className="relative z-10 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-[1.8] tracking-tight animate-fade-in pb-4 md:pb-8">
              MyVillage
            </h1>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4 md:mb-6 leading-[1.8] animate-fade-in pb-4 md:pb-8" style={{ animationDelay: '0.2s' }}>
              Talent
            </div>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-[1.8] font-medium mb-4 md:mb-6 animate-fade-in pb-4 md:pb-8 overflow-visible px-4" style={{ animationDelay: '0.4s' }}>
            Where exceptional talent meets extraordinary opportunities
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8 animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/browse-students')}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-6 md:px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base"
            >
              Browse Talented Students
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/post-job')}
              className={`w-full sm:w-auto border-2 px-6 md:px-8 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base ${
                isDark 
                  ? 'border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-500' 
                  : 'border-primary/60 hover:border-primary bg-white hover:bg-primary hover:text-white'
              }`}
            >
              Post a Job
            </Button>
          </div>
          
          <div className="flex justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
