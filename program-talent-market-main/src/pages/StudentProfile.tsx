
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Linkedin, Github, Link } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const UpworkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://cdn.simpleicons.org/upwork/FFFFFF" alt="Upwork" className={className ?? ''} />
);

const FiverrIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://cdn.simpleicons.org/fiverr/FFFFFF" alt="Fiverr" className={className ?? ''} />
);

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        if (!id) { setStudent(null); setLoading(false); return; }
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name,last_name,display_name,email,avatar_url,bio,user_id')
          .eq('user_id', id)
          .maybeSingle();
        if (error) throw error;
        if (!data) { setStudent(null); }
        else {
          const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.display_name || (data.email ? data.email.split('@')[0] : 'Student');
          setStudent({
            name,
            title: data.display_name || 'Student',
            email: data.email,
            avatarUrl: data.avatar_url,
            aboutMe: data.bio,
            description: data.bio,
            price: null,
            skills: [],
            contact: undefined,
            portfolio: [],
            affiliation: undefined,
          });
        }
      } catch (e) {
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold">Loading profile...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold">Student Not Found</h2>
            <p className="text-muted-foreground">The student profile you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={student.avatarUrl} alt={student.name} />
              <AvatarFallback className="text-xl">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">{student.name}</h1>
                {student.affiliation && (
                  <Badge
                    variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}
                    className="rounded-full text-xs px-2 py-0.5"
                  >
                    {student.affiliation === 'alumni' ? 'MyVillage Alumni' : 'MyVillage Student'}
                  </Badge>
                )}
              </div>
              <p className="text-xl text-muted-foreground mb-4">{student.title}</p>
              
              {/* Mock rating/location/response removed to avoid fake data */}

              <div className="flex flex-wrap gap-2 mb-6">
                {student.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Student
                  </Button>
                  <Button variant="outline" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Schedule Call
                  </Button>
                </div>
                
                {/* Platform Links with Logos */}
                <div className="flex items-center gap-3">
                  {student.contact?.linkedinUrl && (
                    <a 
                      href={student.contact.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#0077b5] hover:bg-[#005885] transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {student.contact?.githubUrl && (
                    <a 
                      href={student.contact.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#24292e] hover:bg-[#1a1e22] transition-colors"
                    >
                      <Github className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {student.contact?.upworkUrl && (
                    <a 
                      href={student.contact.upworkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#14A800] hover:brightness-95 transition-colors"
                      title="Upwork"
                    >
                      <UpworkIcon className="h-5 w-5" />
                    </a>
                  )}
                  {student.contact?.fiverrUrl && (
                    <a 
                      href={student.contact.fiverrUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#1DBF73] hover:brightness-95 transition-colors"
                      title="Fiverr"
                    >
                      <FiverrIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">{student.price || '—'}</div>
              <div className="text-muted-foreground">per hour</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {student.aboutMe || student.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{student.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {student.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rate</span>
                    <span className="font-semibold text-primary">{student.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          {student.portfolio && student.portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.portfolio.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                        )}
                        {item.link && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              View Project
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews hidden until real data source is wired */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sidebar sections hidden until backed by real data */}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
