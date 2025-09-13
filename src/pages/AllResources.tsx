import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Users, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LS_KEY = "student.resources";

function getIconForType(type: string) {
  switch (type) {
    case 'video': return Video;
    case 'guide': return Award;
    case 'workshop': return FileText;
    case 'networking': return Users;
    default: return FileText;
  }
}

function loadResources() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

const AllResources = () => {
  const [resources, setResources] = React.useState(loadResources());
  const [filter, setFilter] = React.useState('all');
  const navigate = useNavigate();

  React.useEffect(() => {
    const handler = () => setResources(loadResources());
    window.addEventListener('resources:updated', handler);
    return () => window.removeEventListener('resources:updated', handler);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartLearning = (resource) => {
    // Track recently viewed
    const viewed = localStorage.getItem('recentlyViewedResources');
    const viewedIds = viewed ? JSON.parse(viewed) : [];
    const newViewed = [resource.id, ...viewedIds.filter(id => id !== resource.id)].slice(0, 5);
    localStorage.setItem('recentlyViewedResources', JSON.stringify(newViewed));
    
    // Navigate to resource detail or start learning
    console.log('Starting learning:', resource.title);
  };

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.type === filter);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8 space-x-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">All Learning Resources</h1>
          <p className="text-muted-foreground text-lg">Explore our complete collection of learning materials</p>
        </div>
        <Button onClick={() => navigate('/student/resources')}>
          <BookOpen className="mr-2 h-4 w-4" />
          Back to Student Resources
        </Button>
      </div>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Resources
            </Button>
            <Button 
              variant={filter === 'workshop' ? 'default' : 'outline'}
              onClick={() => setFilter('workshop')}
            >
              Workshops
            </Button>
            <Button 
              variant={filter === 'video' ? 'default' : 'outline'}
              onClick={() => setFilter('video')}
            >
              Videos
            </Button>
            <Button 
              variant={filter === 'guide' ? 'default' : 'outline'}
              onClick={() => setFilter('guide')}
            >
              Guides
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {filteredResources.map((resource) => {
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
                      onClick={() => handleStartLearning(resource)}
                    >
                      {resource.status === 'coming-soon' ? 'Notify Me' : 'Start Learning'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default AllResources;
