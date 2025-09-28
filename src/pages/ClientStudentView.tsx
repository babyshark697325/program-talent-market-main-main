import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, MapPin, Clock, DollarSign, Calendar, Users, Mail, Bookmark, User, Star, ExternalLink, ArrowLeft, Linkedin, Github, Phone } from 'lucide-react';
import { mockStudents } from '@/data/mockStudents';
import { mockReviews } from '@/data/mockReviews';
import { useAuth } from "@/contexts/AuthContext";

const ClientStudentView = () => {
  const { id } = useParams();
  const student = mockStudents.find(s => s.id === parseInt(id || '0'));
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isClientRole = userRole === 'client';
  const isClientContext = isClientRole || Boolean((location.state as any)?.clientView);

  // Scroll to top when component mounts or student ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleContactStudent = () => {
    // TODO: Implement contact functionality
    console.log('Contact student:', student?.name);
  };

  const handleHireStudent = () => {
    // Navigate to the hire student demo page
    navigate('/hire-student', { 
      state: { 
        student: student
      } 
    });
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark student:', student?.name);
  };

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

  // Calculate average rating
  const studentReviews = mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student');
  const averageRating = studentReviews.length > 0 
    ? studentReviews.reduce((sum, review) => sum + review.rating, 0) / studentReviews.length 
    : 0;

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Back Navigation */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/browse-students')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Students
      </Button>

      {/* Main Student Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {/* Student Avatar and Status */}
            <div className="relative">
              <Avatar className={`w-16 h-16 border-2 ${student.affiliation === 'alumni' ? 'border-green-500' : 'border-primary'}`}>
                {student.avatarUrl ? (
                  <AvatarImage src={student.avatarUrl} alt={`${student.name} profile`} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Student Info */}
            <div className="flex-1 space-y-2">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{student.name}</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">{student.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {student.aboutMe || student.description}
                </p>
              </div>


            </div>

            {/* Rate and Actions */}
            <div className="text-right space-y-3">
              <div>
                <div className="text-xl font-bold text-primary mb-1">{student.price}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>per project</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button onClick={handleHireStudent} className="w-full" size="sm">
                  <Users className="mr-2 h-3 w-3" />
                  Hire Student
                </Button>
                <Button variant="outline" onClick={handleContactStudent} className="w-full" size="sm">
                  <Mail className="mr-2 h-3 w-3" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills?.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          {student.portfolio && student.portfolio.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio</CardTitle>
                <CardDescription className="text-xs">Recent work and projects</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {student.portfolio.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      {item.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-3">
                        <h4 className="font-medium mb-1 text-sm">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.link && (
                          <Button variant="outline" size="sm" asChild className="text-xs h-7">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-1 h-3 w-3" />
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
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-4 h-4" />
                Reviews
                <Badge variant="secondary" className="ml-1 text-xs">
                  {mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student').length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                What clients say about {student.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Overall Rating Summary */}
                {(() => {
                  const studentReviews = mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student');
                  const averageRating = studentReviews.length > 0 
                    ? studentReviews.reduce((sum, review) => sum + review.rating, 0) / studentReviews.length 
                    : 0;
                  
                  return studentReviews.length > 0 ? (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {studentReviews.length} review{studentReviews.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Based on feedback from previous projects
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-muted-foreground">
                      <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No reviews yet</p>
                      <p className="text-xs">Be the first to work with {student.name}!</p>
                    </div>
                  );
                })()}

                {/* Individual Reviews */}
                {mockReviews
                  .filter(review => review.targetId === student.id && review.targetType === 'student')
                  .slice(0, 3)
                  .map((review) => (
                    <div key={review.id} className="border-l-2 border-primary/20 pl-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                            <AvatarFallback className="text-xs">
                              {review.reviewerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{review.reviewerName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1 text-sm">{review.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {review.comment}
                        </p>
                      </div>
                      
                      {review.projectTitle && (
                        <div className="text-xs text-muted-foreground">
                          Project: {review.projectTitle}
                        </div>
                      )}
                      
                      {review.verified && (
                        <Badge variant="outline" className="text-xs h-5">
                          Verified Project
                        </Badge>
                      )}
                    </div>
                  ))}

                {/* Show more reviews button */}
                {mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student').length > 3 && (
                  <Button variant="outline" className="w-full text-xs h-8">
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
              <CardTitle>Student Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Rate:</span>
                  </div>
                  <span className="font-bold text-primary">{student.price}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Delivery:</span>
                  </div>
                  <span className="font-medium">2-5 days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Status:</span>
                  </div>
                  <Badge variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}>
                    {student.affiliation === 'alumni' ? 'Alumni' : 'Student'}
                  </Badge>
                </div>
              </div>
              
              {(() => {
                const studentReviews = mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student');
                const averageRating = studentReviews.length > 0 
                  ? studentReviews.reduce((sum, review) => sum + review.rating, 0) / studentReviews.length 
                  : 0;
                
                return studentReviews.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Rating:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{averageRating.toFixed(1)}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({studentReviews.length})</span>
                    </div>
                  </div>
                );
              })()}
              
              <div className="pt-2">
                <h4 className="font-semibold mb-2">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last active:</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Projects this month:</span>
                    <span>{Math.floor(Math.random() * 5) + 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Success rate:</span>
                    <span>98%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Links & Contact */}
          {student.contact && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Links & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Professional Profiles</h4>
                  <div className="space-y-2">
                    {student.contact.linkedinUrl && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={student.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn Profile
                        </a>
                      </Button>
                    )}
                    {student.contact.githubUrl && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={student.contact.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub Portfolio
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
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {student.contact?.email && (
                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{student.contact.email}</span>
                      </div>
                    )}
                    {student.contact?.phone && (
                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{student.contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions & Hire */}
          <Card>
            <CardHeader>
              <CardTitle>Ready to Get Started?</CardTitle>
              <CardDescription>Take action and connect with this talented student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Primary Actions</h4>
                <div className="space-y-3">
                  <Button onClick={handleHireStudent} className="w-full" size="lg">
                    <Users className="mr-2 h-4 w-4" />
                    Hire This Student
                  </Button>
                  <Button variant="outline" onClick={handleContactStudent} className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3">Additional Options</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule a Call
                    <span className="ml-auto text-xs text-muted-foreground">15-30 min</span>
                  </Button>
                  <Button variant="outline" onClick={handleBookmark} className="w-full justify-start">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save for Later
                    <span className="ml-auto text-xs text-muted-foreground">Add to list</span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Quick Response Guarantee</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This student typically responds to messages within 2-4 hours during business hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientStudentView;
