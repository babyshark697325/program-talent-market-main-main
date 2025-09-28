import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, CheckCircle, User, Calendar, Clock, DollarSign, MessageSquare, Star } from 'lucide-react';

const HireStudentDemo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold">No Student Selected</h2>
            <Button onClick={() => navigate('/browse-students')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse Students
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - show success
      setStep(4);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Confirm Hiring</CardTitle>
              <CardDescription>Review the student details before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="w-16 h-16">
                  {student.avatarUrl ? (
                    <AvatarImage src={student.avatarUrl} alt={student.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{student.name}</h3>
                  <p className="text-muted-foreground">{student.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.9</span>
                    </div>
                    <Badge variant="secondary">{student.price}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">Available Now</h4>
                    <p className="text-sm text-muted-foreground">Can start immediately</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">Quick Response</h4>
                    <p className="text-sm text-muted-foreground">Replies within 2-4 hours</p>
                  </CardContent>
                </Card>
              </div>
              
              <Button onClick={handleNext} className="w-full" size="lg">
                Continue with {student.name}
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Project Details</CardTitle>
              <CardDescription>Tell {student.name} about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Type</label>
                  <div className="mt-2">
                    <Badge variant="outline" className="mr-2">Web Development</Badge>
                    <Badge variant="outline" className="mr-2">UI/UX Design</Badge>
                    <Badge variant="outline">Mobile App</Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Budget Range</label>
                  <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">$500 - $2,000</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Timeline</label>
                  <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>2-3 weeks</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="flex-1" 
                  size="lg"
                >
                  Go Back
                </Button>
                <Button onClick={handleNext} className="flex-1" size="lg">
                  Send Project Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Almost There!</CardTitle>
              <CardDescription>Your request is being sent to {student.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg mb-2">Notification Sent!</p>
                <p className="text-muted-foreground">
                  {student.name} will receive your project details and respond within 2-4 hours.
                </p>
              </div>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">What happens next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {student.name} reviews your project details</li>
                  <li>• They'll send you a custom proposal</li>
                  <li>• You can chat directly to discuss specifics</li>
                  <li>• Once agreed, work begins!</li>
                </ul>
              </div>
              
              <Button onClick={handleNext} className="w-full" size="lg">
                Complete Request
              </Button>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                Request Sent Successfully!
              </CardTitle>
              <CardDescription>Your hiring request has been sent to {student.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-lg mb-2">All Done! 🎉</p>
                <p className="text-muted-foreground mb-6">
                  {student.name} will get back to you soon with a personalized proposal.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/view-student/${student.id}`)}
                  className="w-full"
                >
                  Back to Profile
                </Button>
                <Button 
                  onClick={() => navigate('/browse-students')} 
                  className="w-full"
                >
                  Browse More Students
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Back Navigation */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step > stepNumber ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 4 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default HireStudentDemo;
