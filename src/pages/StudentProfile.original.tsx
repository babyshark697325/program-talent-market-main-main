import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  User, Edit3, Save, X, Plus, Trash2, Mail, Phone, MapPin,
  Linkedin, Github, DollarSign, CreditCard, Calendar,
  ExternalLink, Building, GraduationCap, Award, Briefcase,
  Star, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

// Types for the component
interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  link: string;
  description: string;
}

interface StudentState {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  location: string;
  bio: string;
  skills: string[];
  experience: ExperienceItem[];
  portfolio: PortfolioItem[];
  platformLinks: {
    linkedin: string;
    github: string;
    upwork: string;
    fiverr: string;
  };
  payments: {
    method: PaymentMethod;
    paypalEmail: string;
    bankAccount: string;
  };
}

type PaymentMethod = '' | 'paypal' | 'bank_transfer' | 'wise';

const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial state with demo data
  const initialStudent: StudentState = {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    avatarUrl: '',
    location: 'San Francisco, CA',
    bio: 'Passionate web developer with experience in React, Node.js, and modern web technologies. I love creating user-friendly applications that solve real-world problems.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'],
    experience: [
      {
        title: 'Frontend Developer',
        company: 'Tech Startup',
        duration: '2023 - Present',
        description: 'Developed responsive web applications using React and TypeScript.'
      },
      {
        title: 'Web Developer Intern',
        company: 'Local Agency',
        duration: '2022 - 2023',
        description: 'Built client websites and learned full-stack development principles.'
      }
    ],
    portfolio: [
      {
        id: 1,
        title: 'E-commerce Platform',
        link: 'https://example.com',
        description: 'Full-stack e-commerce solution with payment integration'
      },
      {
        id: 2,
        title: 'Task Management App',
        link: 'https://github.com/example',
        description: 'React-based productivity application with real-time updates'
      }
    ],
    platformLinks: {
      linkedin: 'https://linkedin.com/in/alexrivera',
      github: 'https://github.com/alexrivera',
      upwork: '',
      fiverr: ''
    },
    payments: {
      method: 'paypal',
      paypalEmail: 'alex@example.com',
      bankAccount: ''
    }
  };

  const [student, setStudent] = useState<StudentState>(initialStudent);
  const [edited, setEdited] = useState<StudentState>(initialStudent);

  // Skills management
  const [newSkill, setNewSkill] = useState('');
  const removeSkill = (skill: string) => {
    setEdited(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };
  const addSkill = () => {
    if (newSkill.trim() && !edited.skills.includes(newSkill.trim())) {
      setEdited(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  // Experience management
  const [newExp, setNewExp] = useState({ title: '', company: '', duration: '', description: '' });
  const removeExperience = (idx: number) => {
    setEdited(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
  };
  const addExperience = () => {
    if (newExp.title.trim() && newExp.company.trim()) {
      setEdited(prev => ({ ...prev, experience: [...prev.experience, { ...newExp }] }));
      setNewExp({ title: '', company: '', duration: '', description: '' });
    }
  };

  // Portfolio management
  const [newPortfolio, setNewPortfolio] = useState({ title: '', link: '', description: '' });
  const removePortfolio = (id: number) => {
    setEdited(prev => ({ ...prev, portfolio: prev.portfolio.filter(item => item.id !== id) }));
  };
  const addPortfolio = () => {
    if (newPortfolio.title.trim()) {
      setEdited(prev => ({ ...prev, portfolio: [...prev.portfolio, { ...newPortfolio, id: Date.now() }] }));
      setNewPortfolio({ title: '', link: '', description: '' });
    }
  };

  const handleEdit = () => {
    setEdited({ ...student });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEdited({ ...student });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStudent({ ...edited });
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your professional profile and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={isEditing ? edited.avatarUrl : student.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">
                    {isEditing ? edited.name : student.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {isEditing ? edited.location : student.location}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={edited.name}
                        onChange={(e) => setEdited(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={edited.email}
                        onChange={(e) => setEdited(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={edited.phone}
                        onChange={(e) => setEdited(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={edited.location}
                        onChange={(e) => setEdited(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={edited.bio}
                      onChange={(e) => setEdited(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{student.bio}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(isEditing ? edited.skills : student.skills).map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} disabled={!newSkill.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isEditing ? edited.experience : student.experience).map((exp, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(idx)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-3">Add Experience</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Job Title"
                        value={newExp.title}
                        onChange={(e) => setNewExp(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Input
                        placeholder="Company"
                        value={newExp.company}
                        onChange={(e) => setNewExp(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Duration (e.g., 2022 - Present)"
                      value={newExp.duration}
                      onChange={(e) => setNewExp(prev => ({ ...prev, duration: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newExp.description}
                      onChange={(e) => setNewExp(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Button onClick={addExperience} disabled={!newExp.title.trim() || !newExp.company.trim()}>
                      <Plus className="mr-2 w-4 h-4" />
                      Add Experience
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Links */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={edited.platformLinks.linkedin}
                      onChange={(e) => setEdited(prev => ({
                        ...prev,
                        platformLinks: { ...prev.platformLinks, linkedin: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input
                      id="github"
                      value={edited.platformLinks.github}
                      onChange={(e) => setEdited(prev => ({
                        ...prev,
                        platformLinks: { ...prev.platformLinks, github: e.target.value }
                      }))}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="upwork">Upwork Profile</Label>
                    <Input
                      id="upwork"
                      value={edited.platformLinks.upwork}
                      onChange={(e) => setEdited(prev => ({
                        ...prev,
                        platformLinks: { ...prev.platformLinks, upwork: e.target.value }
                      }))}
                      placeholder="https://upwork.com/freelancers/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fiverr">Fiverr Profile</Label>
                    <Input
                      id="fiverr"
                      value={edited.platformLinks.fiverr}
                      onChange={(e) => setEdited(prev => ({
                        ...prev,
                        platformLinks: { ...prev.platformLinks, fiverr: e.target.value }
                      }))}
                      placeholder="https://fiverr.com/username"
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {student.platformLinks.linkedin && (
                    <Button variant="outline" asChild>
                      <a href={student.platformLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 w-4 h-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {student.platformLinks.github && (
                    <Button variant="outline" asChild>
                      <a href={student.platformLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 w-4 h-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {student.platformLinks.upwork && (
                    <Button variant="outline" asChild>
                      <a href={student.platformLinks.upwork} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 w-4 h-4" />
                        Upwork
                      </a>
                    </Button>
                  )}
                  {student.platformLinks.fiverr && (
                    <Button variant="outline" asChild>
                      <a href={student.platformLinks.fiverr} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 w-4 h-4" />
                        Fiverr
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isEditing ? edited.portfolio : student.portfolio).map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-primary hover:underline inline-flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Project
                        </a>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePortfolio(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-3">Add Project</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Project Title"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="Project Link (optional)"
                      value={newPortfolio.link}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, link: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Project Description"
                      value={newPortfolio.description}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Button onClick={addPortfolio} disabled={!newPortfolio.title.trim()}>
                      <Plus className="mr-2 w-4 h-4" />
                      Add Project
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label>Preferred Payment Method</Label>
                    <Select
                      value={edited.payments.method}
                      onValueChange={(value) => setEdited(prev => ({
                        ...prev,
                        payments: { ...prev.payments, method: value as PaymentMethod }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="wise">Wise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {edited.payments.method === 'paypal' && (
                    <div>
                      <Label htmlFor="paypal">PayPal Email</Label>
                      <Input
                        id="paypal"
                        type="email"
                        value={edited.payments.paypalEmail}
                        onChange={(e) => setEdited(prev => ({
                          ...prev,
                          payments: { ...prev.payments, paypalEmail: e.target.value }
                        }))}
                        placeholder="your-paypal@email.com"
                      />
                    </div>
                  )}
                  
                  {edited.payments.method === 'bank_transfer' && (
                    <div>
                      <Label htmlFor="bank">Bank Account Details</Label>
                      <Input
                        id="bank"
                        value={edited.payments.bankAccount}
                        onChange={(e) => setEdited(prev => ({
                          ...prev,
                          payments: { ...prev.payments, bankAccount: e.target.value }
                        }))}
                        placeholder="Account details"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="capitalize">{student.payments.method?.replace('_', ' ') || 'Not set'}</span>
                  </div>
                  {student.payments.method === 'paypal' && student.payments.paypalEmail && (
                    <p className="text-sm text-muted-foreground mt-2">
                      PayPal: {student.payments.paypalEmail}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications about new opportunities</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Control who can view your profile</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;
