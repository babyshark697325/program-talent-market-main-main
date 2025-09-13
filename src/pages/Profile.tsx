import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Edit, Save, X, Plus, Image, ExternalLink, Trash2, Users, Linkedin, Github, Link, Eye } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import PageHeader from '@/components/PageHeader';
import { loadUserSettings, saveUserSettings } from '@/lib/userSettings';
import { useToast } from '@/hooks/use-toast';

// Brand icons for platform links
const UpworkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`inline-flex items-center justify-center rounded-full bg-[#14A800] text-white font-semibold ${className ?? ''}`} style={{ fontSize: '0.6rem', lineHeight: 1 }}>
    U
  </span>
);

const FiverrIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`inline-flex items-center justify-center rounded-full bg-[#1DBF73] text-white font-semibold ${className ?? ''}`} style={{ fontSize: '0.6rem', lineHeight: 1 }}>
    F
  </span>
);

const STUDENT_PROFILE_KEY = 'myvillage-student-profile';
const STUDENT_SETTINGS_KEY = 'myvillage-student-settings';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    avatarUrl: '',
    bio: '',
    skills: [] as string[],
    experience: [] as any[],
    portfolio: [] as any[],
    platformLinks: {
      linkedin: '',
      upwork: '',
      fiverr: '',
      github: ''
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [newExp, setNewExp] = useState({ title: "", company: "", duration: "", description: "" });
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [emailSettings, setEmailSettings] = useState({ jobAlerts: true, messages: true });
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", description: "", link: "", imageUrl: "" });
  const portfolioFormRef = useRef<HTMLDivElement>(null);
  const portfolioTitleInputRef = useRef<HTMLInputElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerAvatarPick = () => fileInputRef.current?.click();
  const handleAvatarChange = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setEditedProfile({ ...editedProfile, avatarUrl: String(reader.result || '') });
    reader.readAsDataURL(file);
  };
  const removeAvatar = () => setEditedProfile({ ...editedProfile, avatarUrl: '' });

  const addPortfolioItem = () => {
    const title = newPortfolio.title.trim();
    if (!title) return;
    const nextId = (editedProfile.portfolio?.length ? Math.max(...editedProfile.portfolio.map((p: any) => p.id)) + 1 : 1);
    const item = {
      id: nextId,
      title,
      description: newPortfolio.description.trim(),
      link: newPortfolio.link.trim(),
      imageUrl: newPortfolio.imageUrl || '',
    } as any;
    setEditedProfile(prev => ({ ...prev, portfolio: [...(prev.portfolio || []), item] }));
    setNewPortfolio({ title: '', description: '', link: '', imageUrl: '' });
    setShowPortfolioForm(false);
  };

  const removePortfolioItem = (id: any) => {
    setEditedProfile(prev => ({ ...prev, portfolio: (prev.portfolio || []).filter((p: any) => p.id !== id) }));
  };

  useEffect(() => {
    if (showPortfolioForm) {
      setTimeout(() => {
        portfolioFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        portfolioTitleInputRef.current?.focus();
      }, 0);
    }
  }, [showPortfolioForm]);

  // Load current user's profile from localStorage first, then Supabase
  useEffect(() => {
    const load = async () => {
      try {
        // First, try to load from localStorage
        const savedProfile = localStorage.getItem(STUDENT_PROFILE_KEY);
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setEditedProfile(parsedProfile);
          setLoadingProfile(false);
          return;
        }
        
        // If no localStorage data, load from Supabase
        const { data: userRes, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError);
          setLoadingProfile(false);
          return;
        }
        
        const user = userRes?.user;
        if (!user) { 
          console.log('No authenticated user found');
          setLoadingProfile(false); 
          return; 
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name,last_name,display_name,email,avatar_url,bio')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile:', error);
          setLoadingProfile(false);
          return;
        }
        
        if (data) {
          const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.display_name || (data.email ? data.email.split('@')[0] : '');
          const loaded = {
            name,
            email: data.email || '',
            phone: '',
            location: '',
            avatarUrl: data.avatar_url || '',
            bio: data.bio || '',
            skills: [] as string[],
            experience: [] as any[],
            portfolio: [] as any[],
            platformLinks: { linkedin: '', upwork: '', fiverr: '', github: '' },
          };
          setProfile(loaded);
          setEditedProfile(loaded);
        } else {
          console.log('No profile data found for user');
        }
      } catch (error) {
        console.error('Unexpected error loading profile:', error);
      } finally { 
        setLoadingProfile(false); 
      }
    };
    load();
  }, []);

  // Load profile and settings from localStorage and database on component mount
  useEffect(() => {
    const loadProfileAndSettings = async () => {
      // Load settings from localStorage first
      const savedSettingsLocal = localStorage.getItem(STUDENT_SETTINGS_KEY);
      if (savedSettingsLocal) {
        const parsedSettings = JSON.parse(savedSettingsLocal);
        setEmailSettings(parsedSettings.emailSettings || emailSettings);
        setTwoFAEnabled(parsedSettings.twoFAEnabled || twoFAEnabled);
      }
      
      // Try to load additional settings from database (fallback)
      const savedSettings = await loadUserSettings('student_settings');
      if (savedSettings) {
        setEmailSettings(savedSettings.emailSettings || emailSettings);
        setTwoFAEnabled(savedSettings.twoFAEnabled || twoFAEnabled);
      }
    };

    loadProfileAndSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Save profile data to profiles table (existing logic)
    try {
      // Save profile to localStorage
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(editedProfile));
      
      // Save settings to localStorage
      const settingsData = {
        emailSettings,
        twoFAEnabled
      };
      localStorage.setItem(STUDENT_SETTINGS_KEY, JSON.stringify(settingsData));
      
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }

    // Save additional settings to user_settings table
    const settingsSuccess = await saveUserSettings('student_settings', {
      emailSettings,
      twoFAEnabled,
    });

    // Save profile data to user_settings for persistence
    const profileSuccess = await saveUserSettings('student_profile', editedProfile);
    
    if (settingsSuccess && profileSuccess) {
      setProfile(editedProfile);
      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (editedProfile.skills.includes(s)) return;
    setEditedProfile({ ...editedProfile, skills: [...editedProfile.skills, s] });
    setNewSkill("");
  };

  const removeSkill = (s: string) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((k) => k !== s),
    });
  };

  const addExperience = () => {
    const t = newExp.title.trim();
    const c = newExp.company.trim();
    const d = newExp.duration.trim();
    const desc = newExp.description.trim();
    if (!t || !c) return;
    setEditedProfile({
      ...editedProfile,
      experience: [...editedProfile.experience, { title: t, company: c, duration: d, description: desc }],
    });
    setNewExp({ title: "", company: "", duration: "", description: "" });
  };

  const removeExperience = (index: number) => {
    const next = editedProfile.experience.slice();
    next.splice(index, 1);
    setEditedProfile({ ...editedProfile, experience: next });
  };

  const [showPreview, setShowPreview] = useState(false);

  // Create preview data from current profile
  const createPreviewData = () => {
    const name = editedProfile.name || profile?.email?.split('@')[0] || 'Student';
    
    return {
      name,
      title: editedProfile.name || 'Student',
      email: profile?.email,
      avatarUrl: editedProfile.avatarUrl,
      aboutMe: editedProfile.bio,
      description: editedProfile.bio,
      price: null,
      skills: editedProfile.skills || [],
      contact: {
        linkedinUrl: editedProfile.platformLinks?.linkedin,
        githubUrl: editedProfile.platformLinks?.github,
        upworkUrl: editedProfile.platformLinks?.upwork,
        fiverrUrl: editedProfile.platformLinks?.fiverr,
      },
      portfolio: editedProfile.portfolio || [],
      affiliation: 'student',
    };
  };

  // Preview Profile Component
  const PreviewProfile = ({ student }: { student: any }) => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="p-6 rounded-lg bg-secondary/30">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={student.avatarUrl} alt={student.name} />
            <AvatarFallback className="text-xl">
              {student.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1
                className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight pb-1"
                style={{ lineHeight: 1.2, paddingBottom: '0.25rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {student.name}
              </h1>
              {student.affiliation && (
                <Badge
                  variant={student.affiliation === 'alumni' ? 'secondary' : 'default'}
                  className="rounded-full text-xs px-2 py-0.5 self-center"
                >
                  {student.affiliation === 'alumni' ? 'MyVillage Alumni' : 'MyVillage Student'}
                </Badge>
              )}
            </div>
            <p className="text-xl text-muted-foreground mb-4">{student.title}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {student.skills.map((skill: string) => (
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
              
              {/* Platform Links */}
              <div className="flex items-center gap-3">
                {student.contact?.linkedinUrl && (
                  <div className="p-2 rounded-lg bg-[#0077b5]">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                )}
                {student.contact?.githubUrl && (
                  <div className="p-2 rounded-lg bg-[#24292e]">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                )}
                {student.contact?.upworkUrl && (
                  <div className="p-2 rounded-lg bg-[#14A800]">
                    <UpworkIcon className="h-5 w-5" />
                  </div>
                )}
                {student.contact?.fiverrUrl && (
                  <div className="p-2 rounded-lg bg-[#1DBF73]">
                    <FiverrIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-primary mb-1">{student.price || '—'}</div>
            <div className="text-muted-foreground">per hour</div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {student.aboutMe || student.description || 'No description provided yet.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg p-4 bg-secondary/30">
                  <h3 className="font-semibold mb-2">{student.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {student.description || 'Professional services available'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rate</span>
                    <span className="font-semibold text-primary">{student.price || 'Contact for pricing'}</span>
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
                  {student.portfolio.map((item: any, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-secondary/20">
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="My Profile" 
        description="Manage your profile information and settings"
      >
        <div className="flex gap-2">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-0">
              <DialogHeader>
                <DialogTitle>Profile Preview - Client View</DialogTitle>
              </DialogHeader>
              <PreviewProfile student={createPreviewData()} />
            </DialogContent>
          </Dialog>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {editedProfile.avatarUrl ? (
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={editedProfile.avatarUrl} alt={editedProfile.name} />
                    </Avatar>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="text-white" size={32} />
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                      />
                      <button
                        type="button"
                        onClick={triggerAvatarPick}
                        aria-label="Change photo"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border bg-background shadow hover:bg-secondary flex items-center justify-center"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                      {editedProfile.avatarUrl && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="mt-2 block text-xs text-muted-foreground hover:text-red-600"
                        >
                          Remove photo
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-medium">{profile.name || '—'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Mail size={16} />
                      {profile.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Phone size={16} />
                      {profile.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                  />
                ) : (
                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {profile.location}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Bio</label>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage your technical skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {editedProfile.skills.map((skill, idx) => (
                    <div key={skill + idx} className="flex items-center gap-1">
                      <Badge variant="secondary">{skill}</Badge>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={addSkill}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Your work experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedProfile.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <div className="border rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Title"
                      value={newExp.title}
                      onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                    />
                    <Input
                      placeholder="Company"
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    />
                    <Input
                      placeholder="Duration"
                      value={newExp.duration}
                      onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      rows={3}
                      className="md:col-span-2"
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    />
                    <div className="md:col-span-2">
                      <Button variant="outline" size="sm" onClick={addExperience}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add Experience
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Showcase your best work and projects</CardDescription>
              </div>
              {isEditing && !showPortfolioForm && (
                <Button variant="outline" size="sm" onClick={() => setShowPortfolioForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing && showPortfolioForm && (
                <div ref={portfolioFormRef} className="border rounded-md p-4 mb-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      ref={portfolioTitleInputRef}
                      placeholder="Project Title"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    />
                    <Input
                      placeholder="Project Link (optional)"
                      value={newPortfolio.link}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })}
                    />
                  </div>
                  <Textarea
                    placeholder="Project Description"
                    rows={3}
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  />
                  <Input
                    placeholder="Image URL (optional)"
                    value={newPortfolio.imageUrl}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, imageUrl: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={addPortfolioItem}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Project
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowPortfolioForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {editedProfile.portfolio.map((item: any) => (
                  <Card key={item.id} className="relative">
                    {item.imageUrl && (
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                              <ExternalLink className="h-3 w-3" />
                              View Project
                            </a>
                          )}
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 -mt-1 -mr-1"
                            onClick={() => removePortfolioItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Platform Connections</CardTitle>
              <CardDescription>Connect your professional profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={editedProfile.platformLinks.linkedin}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, linkedin: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile.platformLinks.linkedin || 'Not connected'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://github.com/username"
                      value={editedProfile.platformLinks.github}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, github: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile.platformLinks.github || 'Not connected'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <UpworkIcon className="h-4 w-4" />
                    Upwork
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://upwork.com/freelancers/username"
                      value={editedProfile.platformLinks.upwork}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, upwork: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile.platformLinks.upwork || 'Not connected'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FiverrIcon className="h-4 w-4" />
                    Fiverr
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://fiverr.com/username"
                      value={editedProfile.platformLinks.fiverr}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, fiverr: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile.platformLinks.fiverr || 'Not connected'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Profile;
