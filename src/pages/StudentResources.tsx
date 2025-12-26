
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Video, FileText, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LearningResource } from '@/types/learning-resource';

function getIconForType(type: string) {
  switch (type) {
    case 'video': return Video;
    case 'guide': return Award;
    case 'workshop': return FileText;
    case 'networking': return Users;
    default: return FileText;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'coming-soon': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

const StudentResources = () => {
  const [resources, setResources] = React.useState<LearningResource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ completed: 0, hours: 0, certs: 0 });
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'available' | 'coming-soon' | 'completed'>('all');
  const [completedSet, setCompletedSet] = React.useState<Set<number>>(new Set());
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('learning_resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching resources:", error);
          setResources([]);
        } else if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: LearningResource[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            type: r.type,
            duration: r.duration,
            status: r.status,
            videoUrl: r.video_url,
            guideUrl: r.guide_url,
            eventDate: r.event_date,
            location: r.location,
            registrationUrl: r.registration_url,
            joinUrl: r.join_url,
            created_at: r.created_at
          }));
          setResources(mapped);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    };

    const loadStats = () => {
      const completed = Number(localStorage.getItem('completedResourcesCount') || '0');
      const hours = Number(localStorage.getItem('hoursLearned') || '0');
      const certs = Number(localStorage.getItem('certificatesEarned') || '0');
      setStats({ completed: isNaN(completed) ? 0 : completed, hours: isNaN(hours) ? 0 : hours, certs: isNaN(certs) ? 0 : certs });
    };

    loadResources();
    loadStats();

    const loadCompleted = () => {
      try {
        const raw = localStorage.getItem('completedResourceIds');
        if (raw) {
          const ids = JSON.parse(raw) as number[];
          if (Array.isArray(ids)) setCompletedSet(new Set(ids));
        }
      } catch {
        setCompletedSet(new Set());
      }
    };
    loadCompleted();
  }, []);

  const filtered = React.useMemo(() => {
    if (statusFilter === 'all') return resources;
    if (statusFilter === 'completed') return resources.filter(r => completedSet.has(r.id));
    return resources.filter(r => r.status === statusFilter);
  }, [resources, statusFilter, completedSet]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">Learning Resources</h1>
          <p className="text-muted-foreground">Enhance your skills with our curated learning materials</p>
        </div>
        <Button onClick={() => navigate('/all-resources')}>
          <BookOpen className="mr-2 h-4 w-4" />
          Browse All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick filter chips */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-end">
        {([
          { key: 'all', label: 'All' },
          { key: 'available', label: 'Available' },
          { key: 'coming-soon', label: 'Soon' },
          { key: 'completed', label: 'Completed' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-[1.02] shadow-sm border ${statusFilter === key
              ? 'bg-primary text-primary-foreground border-transparent'
              : 'bg-secondary/60 text-foreground border-border'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Available Resources</CardTitle>
          <CardDescription>Choose from our collection of learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No resources available at the moment.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {filtered.map((resource) => {
                const IconComponent = getIconForType(resource.type);
                return (
                  <Card key={resource.id} className="flex flex-col relative">
                    <CardHeader className="flex-1 pt-3 pb-2">
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                          {resource.status === 'coming-soon' ? 'Soon' : 'Available'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="text-primary opacity-80" size={16} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 leading-tight font-semibold">{resource.title}</CardTitle>
                          <CardDescription className="text-xs leading-snug line-clamp-3 mb-2">{resource.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {resource.duration}
                        </div>
                      </div>
                      <Button
                        className="w-full h-8 text-xs"
                        disabled={resource.status === 'coming-soon'}
                      >
                        {resource.status === 'coming-soon' ? 'Notify Me' : 'Start Learning'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResources;
