import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Star, MapPin, ExternalLink, Briefcase, GraduationCap, User, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { mockStudents } from '@/data/mockStudents';
import { StudentService } from '@/types/student';
import PageHeader from '@/components/PageHeader';

const StudentView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundStudent = mockStudents.find(s => s.id === parseInt(id));
      setStudent(foundStudent || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-muted-foreground">Student Not Found</h2>
          <p className="mt-4 text-muted-foreground">The student profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/browse-students')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse Students
          </Button>
        </div>
      </div>
    );
  }

  const handleContactStudent = () => {
    // TODO: Implement contact functionality (message modal, email, etc.)
    console.log('Contact student:', student.name);
  };

  const handleHireStudent = () => {
    // TODO: Implement hire functionality (redirect to job posting, etc.)
    console.log('Hire student:', student.name);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/browse-students')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </div>

      {/* Student Profile Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className={`w-24 h-24 border-4 ${student.affiliation === 'alumni' ? 'border-[#D4AF37]' : 'border-primary'}`}>
                {student.avatarUrl ? (
                  <AvatarImage src={student.avatarUrl} alt={`${student.name} profile`} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              {student.affiliation && (
                <Badge
                  variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}
                  className={`absolute -bottom-2 -right-2 ${student.affiliation === 'alumni' ? 'bg-[#D4AF37] text-black border border-[#D4AF37]' : ''}`}
                >
                  {student.affiliation === 'alumni' ? 'Alumni' : 'Student'}
                </Badge>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
                <p className="text-xl text-muted-foreground mt-1">{student.title}</p>
              </div>
              
              <div className="text-2xl font-bold text-primary">{student.price}</div>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {student.contact?.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{student.contact.email}</span>
                  </div>
                )}
                {student.contact?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{student.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button onClick={handleHireStudent} size="lg">
                <Briefcase className="mr-2 h-5 w-5" />
                Hire Student
              </Button>
              <Button variant="outline" onClick={handleContactStudent} size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Contact
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {student.aboutMe || student.description}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills?.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          {student.portfolio && student.portfolio.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {student.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {item.imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Project
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Professional Links */}
          {student.contact && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Professional Links</h3>
              <div className="flex flex-wrap gap-3">
                {student.contact.linkedinUrl && (
                  <Button variant="outline" asChild>
                    <a href={student.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {student.contact.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={student.contact.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {student.contact.upworkUrl && (
                  <Button variant="outline" asChild>
                    <a href={student.contact.upworkUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Upwork
                    </a>
                  </Button>
                )}
                {student.contact.fiverrUrl && (
                  <Button variant="outline" asChild>
                    <a href={student.contact.fiverrUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Fiverr
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentView;
