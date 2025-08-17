
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, MapPin, Clock, DollarSign, Calendar, Users, Mail, Bookmark } from 'lucide-react';
import { mockJobs } from '@/data/mockJobs';

const JobDetail = () => {
  const { id } = useParams();
  const job = mockJobs.find(j => j.id === parseInt(id || '0'));

  if (!job) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold">Job Not Found</h2>
            <p className="text-muted-foreground">The job posting you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Building className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <p className="text-xl text-muted-foreground">{job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Remote</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{job.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Posted {job.postedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">15 applicants</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-2">
                <DollarSign className="h-6 w-6" />
                {job.budget}
              </div>
              <div className="text-muted-foreground mb-4">Budget</div>
              
              <div className="flex flex-col gap-2">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  <Mail className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
                <Button variant="outline" size="lg">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Job
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-muted-foreground">
                <p className="mb-4">{job.description}</p>
                <p className="mb-4">
                  We are looking for a talented developer to join our team and help build innovative solutions. 
                  The ideal candidate will have strong problem-solving skills and experience with modern web technologies.
                </p>
                <p>
                  This is a great opportunity to work with a dynamic team and contribute to exciting projects 
                  that will have a real impact on our users.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Strong communication and collaboration skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Ability to work independently and meet deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Portfolio demonstrating relevant experience</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Competitive compensation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Flexible working hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Remote work opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Professional development opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Collaborative and supportive team environment</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{job.company}</h3>
                <p className="text-muted-foreground text-sm">
                  A leading technology company focused on innovation and digital transformation. 
                  We've been helping businesses grow through cutting-edge solutions for over 10 years.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">Technology</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Company Size</span>
                  <span className="font-medium">50-200 employees</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-medium">2014</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">San Francisco, CA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span className="text-sm">Submit your application</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="text-sm text-muted-foreground">Initial screening call</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span className="text-sm text-muted-foreground">Technical interview</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span className="text-sm text-muted-foreground">Final decision</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockJobs.slice(0, 3).filter(j => j.id !== job.id).map((similarJob) => (
                  <div key={similarJob.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <h4 className="font-medium text-sm">{similarJob.title}</h4>
                    <p className="text-xs text-muted-foreground">{similarJob.company}</p>
                    <p className="text-xs text-primary font-medium">{similarJob.budget}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
