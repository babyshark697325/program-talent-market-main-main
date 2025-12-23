import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, MapPin, Clock, DollarSign, Calendar, Users, Mail, Bookmark, User, Star, ExternalLink, ArrowLeft, Linkedin, Github, Phone } from 'lucide-react';
import { GradientAvatarFallback } from "@/components/GradientAvatarFallback";
import { supabase } from '@/integrations/supabase/client';
import { mockReviews } from '@/data/mockReviews';
import { useAuth } from "@/contexts/AuthContext";

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = React.useState<{
    id: string;
    name: string;
    title: string;
    avatarUrl?: string;
    affiliation?: 'student' | 'alumni';
    contact?: { email?: string; phone?: string; linkedinUrl?: string; githubUrl?: string; upworkUrl?: string; fiverrUrl?: string };
    price: string;
    aboutMe?: string;
    description?: string;
    skills?: string[];
    portfolio?: { id: string; title: string; imageUrl?: string; description?: string; link?: string }[];
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudent = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('prelaunch_signups')
          .select('*')
          .eq('cic_id', id)
          .single();
        if (error || !data) {
          setStudent(null);
        } else {
          setStudent(data);
        }
      }
      setLoading(false);
    };
    fetchStudent();
  }, [id]);
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isClientRole = userRole === 'client';
  const isClientContext = isClientRole || Boolean((location.state as { clientView?: boolean })?.clientView);

  // Scroll to top when component mounts or student ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleContactStudent = () => {
    // TODO: Implement contact functionality
    console.log('Contact student:', student?.name);
  };

  const handleHireStudent = () => {
    // TODO: Implement hire functionality
    console.log('Hire student:', student?.name);
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark student:', student?.name);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading student profile...</p>
        </div>
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
            <Button onClick={() => navigate('/browse-students')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse Students
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Student Avatar */}
              <div className="relative">
                <Avatar className={`w-20 h-20 border-4 ${student.affiliation === 'alumni' ? 'border-[#D4AF37]' : 'border-primary'}`}>
                  {student.avatarUrl && (
                    <AvatarImage src={student.avatarUrl} alt={`${student.name} profile`} />
                  )}
                  <GradientAvatarFallback className="text-xl">
                    <User className="w-8 h-8" />
                  </GradientAvatarFallback>
                </Avatar>

                {student.affiliation && (
                  <Badge
                    variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}
                    className={`absolute -bottom-1 -right-1 ${student.affiliation === 'alumni' ? 'bg-[#D4AF37] text-black border border-[#D4AF37]' : ''}`}
                  >
                    {student.affiliation === 'alumni' ? 'Alumni' : 'Student'}
                  </Badge>
                )}
              </div>

              <div className="flex-1">
                <CardTitle className="text-2xl lg:text-3xl mb-2">{student.name}</CardTitle>
                <CardDescription className="text-lg mb-3">{student.title}</CardDescription>

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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
              <div className="text-right mb-2">
                <span className="text-2xl font-bold text-primary">{student.price}</span>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleHireStudent} size="lg">
                  <Users className="mr-2 h-4 w-4" />
                  Hire Student
                </Button>
                <Button variant="outline" onClick={handleContactStudent} size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
                <Button variant="outline" size="lg" onClick={handleBookmark}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
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

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          {student.portfolio && student.portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Recent work and projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Reviews
                <Badge variant="secondary" className="ml-2">
                  {mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student').length}
                </Badge>
              </CardTitle>
              <CardDescription>
                What clients say about {student.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Overall Rating Summary */}
                {(() => {
                  const studentReviews = mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student');
                  const averageRating = studentReviews.length > 0
                    ? studentReviews.reduce((sum, review) => sum + review.rating, 0) / studentReviews.length
                    : 0;

                  return studentReviews.length > 0 ? (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {studentReviews.length} review{studentReviews.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on feedback from previous projects
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No reviews yet</p>
                      <p className="text-sm">Be the first to work with {student.name}!</p>
                    </div>
                  );
                })()}

                {/* Individual Reviews */}
                {mockReviews
                  .filter(review => review.targetId === student.id && review.targetType === 'student')
                  .slice(0, 3) // Show first 3 reviews
                  .map((review) => (
                    <div key={review.id} className="border-l-4 border-primary/20 pl-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                            <AvatarFallback>
                              {review.reviewerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.reviewerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">{review.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      {review.projectTitle && (
                        <div className="text-xs text-muted-foreground">
                          Project: {review.projectTitle}
                        </div>
                      )}

                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified Project
                        </Badge>
                      )}
                    </div>
                  ))}

                {/* Show more reviews button */}
                {mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student').length > 3 && (
                  <Button variant="outline" className="w-full">
                    View All Reviews ({mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student').length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Rate:</span>
                <span className="font-semibold">{student.price}</span>
              </div>

              {(() => {
                const studentReviews = mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student');
                const averageRating = studentReviews.length > 0
                  ? studentReviews.reduce((sum, review) => sum + review.rating, 0) / studentReviews.length
                  : 0;

                return studentReviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({studentReviews.length})</span>
                    </div>
                  </div>
                );
              })()}

              {student.affiliation && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}>
                    {student.affiliation === 'alumni' ? 'Alumni' : 'Student'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Links */}
          {student.contact && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.contact.linkedinUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={student.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {student.contact.githubUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={student.contact.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {student.contact.upworkUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={student.contact.upworkUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Upwork Profile
                    </a>
                  </Button>
                )}
                {student.contact.fiverrUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={student.contact.fiverrUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Fiverr Profile
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleHireStudent} className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Hire This Student
              </Button>
              <Button variant="outline" onClick={handleContactStudent} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Separator />
              <Button variant="outline" onClick={handleBookmark} className="w-full">
                <Bookmark className="mr-2 h-4 w-4" />
                Save for Later
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
