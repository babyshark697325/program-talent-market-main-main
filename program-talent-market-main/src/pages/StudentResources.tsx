
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Users, Award, Clock } from 'lucide-react';

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
  return [
    {
      id: 1,
      title: 'Resume Writing Workshop',
      description: 'Learn how to create compelling resumes that get noticed',
      type: 'workshop',
      duration: '2 hours',
      icon: FileText,
      status: 'available'
    },
    {
      id: 2,
      title: 'Interview Skills Masterclass',
      description: 'Master the art of interviewing with practice sessions',
      type: 'video',
      duration: '1.5 hours',
      icon: Video,
      status: 'available'
    },
    {
      id: 3,
      title: 'Portfolio Development Guide',
      description: 'Build a portfolio that showcases your best work',
      type: 'guide',
      duration: '3 hours',
      icon: Award,
      status: 'coming-soon'
    },
    {
      id: 4,
      title: 'Networking for Students',
      description: 'Connect with industry professionals and peers',
      type: 'workshop',
      duration: '1 hour',
      icon: Users,
      status: 'available'
    }
  ];
}

const StudentResources = () => {
  const [resources, setResources] = React.useState(loadResources());

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">Learning Resources</h1>
          <p className="text-muted-foreground">Enhance your skills with our curated learning materials</p>
        </div>
        <Button>
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
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
          <CardDescription>Choose from our collection of learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => {
              const IconComponent = getIconForType(resource.type);
              return (
                <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock size={12} />
                        {resource.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status === 'coming-soon' ? 'Coming Soon' : 'Available'}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={resource.status === 'coming-soon'}
                    >
                      {resource.status === 'coming-soon' ? 'Notify Me' : 'Start Learning'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResources;
