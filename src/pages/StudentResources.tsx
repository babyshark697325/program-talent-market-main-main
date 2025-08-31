
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LS_KEY = "student.resources";

// Card icons removed for a cleaner list; keep KPIs/header icons only

function loadResources() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

const StudentResources = () => {
  const [resources, setResources] = React.useState(loadResources());
  const [stats, setStats] = React.useState({ completed: 0, hours: 0, certs: 0 });
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'available' | 'coming-soon' | 'completed'>('all');
  const [completedSet, setCompletedSet] = React.useState<Set<number>>(new Set());
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadStats = () => {
      const completed = Number(localStorage.getItem('completedResourcesCount') || '0');
      const hours = Number(localStorage.getItem('hoursLearned') || '0');
      const certs = Number(localStorage.getItem('certificatesEarned') || '0');
      setStats({ completed: isNaN(completed) ? 0 : completed, hours: isNaN(hours) ? 0 : hours, certs: isNaN(certs) ? 0 : certs });
    };

    const handler = () => setResources(loadResources());
    const storageHandler = () => { loadStats(); loadCompleted(); };

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
    window.addEventListener('resources:updated', handler);
    window.addEventListener('storage', storageHandler);
    window.addEventListener('progress:updated', storageHandler);
    return () => {
      window.removeEventListener('resources:updated', handler);
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('progress:updated', storageHandler);
    };
  }, []);

  const filtered = React.useMemo(() => {
    if (statusFilter === 'all') return resources;
    if (statusFilter === 'completed') return resources.filter(r => completedSet.has(r.id));
    return resources.filter(r => r.status === statusFilter);
  }, [resources, statusFilter, completedSet]);

  const renderStatusBadge = (status: string) => (
    <Badge
      variant={status === 'available' ? 'default' : 'secondary'}
      className="text-xs px-2 py-0.5 rounded-full"
    >
      {status === 'coming-soon' ? 'Soon' : 'Available'}
    </Badge>
  );

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
            <Clock className="h-4 w-4 text-blue-600" />
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
            className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-[1.02] shadow-sm border ${
              statusFilter === key
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {filtered.map((resource) => {
              return (
                <Card key={resource.id} className="flex flex-col relative">
                  <CardHeader className="flex-1 pt-3 pb-2">
                    <div className="absolute top-3 right-3">
                      {renderStatusBadge(resource.status)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 leading-tight font-semibold">{resource.title}</CardTitle>
                      <CardDescription className="text-xs leading-snug line-clamp-3 mb-2">{resource.description}</CardDescription>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResources;
