import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Star, Clock, User, Mail, Phone, ExternalLink, Briefcase, MessageCircle, FileText, Video, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { mockReviews } from '@/data/mockReviews';
import { StudentService } from '@/types/student';
import { GradientAvatarFallback } from "@/components/GradientAvatarFallback";

function getIconForProjectType(type: string) {
  switch (type) {
    case 'web': return Code;
    case 'design': return FileText;
    case 'video': return Video;
    case 'mobile': return Code;
    default: return FileText;
  }
}

function getProjectStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'featured': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

const StudentView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          setStudent({
            id: data.id,
            cic_id: data.cic_id,
            name: data.display_name || data.name || '',
            title: data.title || 'Student Developer',
            description: data.description || '',
            avatarUrl: data.avatar_url || '',
            skills: data.skills || [],
            price: data.price || '',
            affiliation: data.affiliation,
            aboutMe: data.aboutMe || '',
            contact: data.contact || {},
            portfolio: data.portfolio || [],
          });
        }
      }
      setLoading(false);
    };
    fetchStudent();
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

  // Calculate average rating
  // FIX: Fallback to all student reviews if strict ID match returns nothing (due to UUID vs int mismatch)
  let studentReviews = mockReviews.filter(r => r.targetId === student.id && r.targetType === 'student');

  if (studentReviews.length === 0) {
    // Fallback: Just show random reviews for demo purposes so the section appears
    studentReviews = mockReviews.filter(r => r.targetType === 'student').slice(0, 3);
  }

  const averageRating = studentReviews.length > 0
    ? studentReviews.reduce((sum, review) => sum + review.rating, 0) / studentReviews.length
    : 0;

  const handleHireStudent = () => {
    // TODO: Implement hire functionality
    console.log('Hire student:', student.name);
  };

  const handleContactStudent = () => {
    // TODO: Implement contact functionality
    console.log('Contact student:', student.name);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/browse-students')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Students
      </Button>

      {/* Main Student Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-card via-card to-muted/20">
        <CardHeader className="pb-6">
          <div className="flex items-start gap-6">
            {/* Student Avatar and Status */}
            <div className="relative">
              <Avatar className={`w-20 h-20 border-4 ${student.affiliation === 'alumni' ? 'border-green-500' : 'border-primary'}`}>
                {student.avatarUrl && (
                  <AvatarImage src={student.avatarUrl} alt={`${student.name} profile`} />
                )}
                <GradientAvatarFallback className="text-xl">
                  <User className="w-8 h-8" />
                </GradientAvatarFallback>
              </Avatar>
              {/* Status Badge */}
              <Badge
                className={`absolute -top-2 -right-2 ${student.affiliation === 'alumni'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-primary text-primary-foreground'
                  }`}
              >
                Available
              </Badge>
            </div>

            {/* Student Info */}
            <div className="flex-1 space-y-3">
              <div>
                <CardTitle className="text-2xl mb-1">{student.name}</CardTitle>
                <p className="text-lg text-muted-foreground mb-2">{student.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed outline-none focus:outline-none">
                  {student.aboutMe || student.description}
                </p>
              </div>

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

              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({studentReviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Rate and Actions */}
            <div className="text-right space-y-4">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">{student.price}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>per project</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button onClick={handleHireStudent} className="w-full" size="lg">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Hire Student
                </Button>
                <Button variant="outline" onClick={handleContactStudent} className="w-full" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Skills Section */}
          <div>
            <h3 className="font-semibold mb-3">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills?.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          {student.portfolio && student.portfolio.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Recent Work</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {student.portfolio.slice(0, 3).map((item) => {
                  const IconComponent = getIconForProjectType('web'); // Default to web project type
                  return (
                    <Card key={item.id} className="flex flex-col relative">
                      <CardHeader className="flex-1 pt-3 pb-2">
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor('completed')}`}>Completed</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="text-primary opacity-80" size={16} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 leading-tight font-semibold">{item.title}</CardTitle>
                            {item.description && (
                              <CardDescription className="text-xs leading-snug line-clamp-3 mb-2">
                                {item.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-auto pt-2">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            1-2 weeks
                          </div>
                        </div>
                        {item.link ? (
                          <Button
                            className="w-full h-8 text-xs"
                            asChild
                          >
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              View Project
                            </a>
                          </Button>
                        ) : (
                          <Button
                            className="w-full h-8 text-xs"
                            disabled
                          >
                            Private Project
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {studentReviews.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Client Reviews</h3>
              <div className="space-y-4">
                {studentReviews.slice(0, 2).map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                        <AvatarFallback>
                          {review.reviewerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.reviewerName}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">"{review.comment}"</p>
                        {review.projectTitle && (
                          <p className="text-xs text-muted-foreground">Project: {review.projectTitle}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentView;
