
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Phone, MapPin, Edit, Save, X, Plus, Image, ExternalLink, Trash2, Users, Linkedin, Github, Link } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
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

  // Load current user's profile from Supabase
  useEffect(() => {
    const load = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes?.user;
        if (!user) { setLoadingProfile(false); return; }
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name,last_name,display_name,email,avatar_url,bio')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
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
        }
      } catch {}
      finally { setLoadingProfile(false); }
    };
    load();
  }, []);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-6">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile information and settings</p>
          {loadingProfile && <p className="text-xs text-muted-foreground">Loading profile...</p>}
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      ref={portfolioTitleInputRef as any}
                      placeholder="Title *"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    />
                    <Input
                      placeholder="Project Link (optional)"
                      value={newPortfolio.link}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      className="md:col-span-2"
                      rows={3}
                      value={newPortfolio.description}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                    />
                    <div className="md:col-span-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = () => setNewPortfolio({ ...newPortfolio, imageUrl: String(r.result || '') });
                          r.readAsDataURL(f);
                        }}
                      />
                      {newPortfolio.imageUrl && (
                        <img src={newPortfolio.imageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-md border" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowPortfolioForm(false);
                        setNewPortfolio({ title: '', description: '', link: '', imageUrl: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={addPortfolioItem}>Add Item</Button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {profile.portfolio?.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removePortfolioItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                      )}
                      {item.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3 w-3" />
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
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowEmailSettings((v) => !v)}>
                  {showEmailSettings ? "Close" : "Manage"}
                </Button>
              </div>
              {showEmailSettings && (
                <div className="mt-3 space-y-3 border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job alerts</p>
                      <p className="text-xs text-muted-foreground">New jobs matching your skills</p>
                    </div>
                    <Switch
                      checked={emailSettings.jobAlerts}
                      onCheckedChange={(v) => setEmailSettings({ ...emailSettings, jobAlerts: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-xs text-muted-foreground">New messages from clients</p>
                    </div>
                    <Switch
                      checked={emailSettings.messages}
                      onCheckedChange={(v) => setEmailSettings({ ...emailSettings, messages: v })}
                    />
                  </div>
                                    <div className="text-right">
                    <Button size="sm" onClick={() => setShowEmailSettings(false)}>Save</Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">2FA</h4>
                  <p className="text-sm text-muted-foreground">Manage two-factor authentication</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShow2FA((v) => !v)}>
                  {show2FA ? "Close" : "Manage"}
                </Button>
              </div>
              {show2FA && (
                <div className="mt-3 space-y-3 border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Enable 2FA</p>
                    <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use an authenticator app to secure your account.
                  </p>
                  <div className="text-right">
                    <Button size="sm" onClick={() => setShow2FA(false)}>Save</Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Close" : "Update"}
                </Button>
              </div>
              {showPassword && (
                <div className="mt-3 space-y-3 border rounded-md p-3">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={pwd.current}
                    onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={pwd.next}
                    onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={pwd.confirm}
                    onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  />
                  <div className="text-right">
                    <Button size="sm" onClick={() => setShowPassword(false)}>Save</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Platform Links</CardTitle>
              <CardDescription>Connect your professional platform profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Linkedin className="h-4 w-4 text-[#0077B5]" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={editedProfile.platformLinks.linkedin}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, linkedin: e.target.value }
                      })}
                    />
                  ) : (
                    profile.platformLinks.linkedin ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.platformLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-3 w-3" />
                          View LinkedIn
                        </a>
                      </Button>
                    ) : (
                      <p className="text-muted-foreground text-sm">Not linked</p>
                    )
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://github.com/yourusername"
                      value={editedProfile.platformLinks.github}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, github: e.target.value }
                      })}
                    />
                  ) : (
                    profile.platformLinks.github ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.platformLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-3 w-3" />
                          View GitHub
                        </a>
                      </Button>
                    ) : (
                      <p className="text-muted-foreground text-sm">Not linked</p>
                    )
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <UpworkIcon className="h-4 w-4" />
                    Upwork
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://upwork.com/freelancers/yourprofile"
                      value={editedProfile.platformLinks.upwork}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, upwork: e.target.value }
                      })}
                    />
                  ) : (
                    profile.platformLinks.upwork ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.platformLinks.upwork} target="_blank" rel="noopener noreferrer">
                          <UpworkIcon className="mr-2 h-3 w-3" />
                          View Upwork
                        </a>
                      </Button>
                    ) : (
                      <p className="text-muted-foreground text-sm">Not linked</p>
                    )
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <FiverrIcon className="h-4 w-4" />
                    Fiverr
                  </label>
                  {isEditing ? (
                    <Input
                      placeholder="https://fiverr.com/yourusername"
                      value={editedProfile.platformLinks.fiverr}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        platformLinks: { ...editedProfile.platformLinks, fiverr: e.target.value }
                      })}
                    />
                  ) : (
                    profile.platformLinks.fiverr ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.platformLinks.fiverr} target="_blank" rel="noopener noreferrer">
                          <FiverrIcon className="mr-2 h-3 w-3" />
                          View Fiverr
                        </a>
                      </Button>
                    ) : (
                      <p className="text-muted-foreground text-sm">Not linked</p>
                    )
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
