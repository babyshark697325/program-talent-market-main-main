import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Eye, Edit, Image, User, X, Plus, Trash2, ExternalLink, Linkedin, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/data/mockStudents';

// Brand icons for platform links (prefer official SVGs in /public/brands, fallback to colored badge)
const UpworkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-label="Upwork"
    className={className}
    focusable="false"
  >
    <circle cx="12" cy="12" r="12" fill="#000" />
    <text
      x="50%"
      y="53%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="13.5"
      fontWeight="800"
      fill="#fff"
      fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    >
      Up
    </text>
  </svg>
);

const FiverrIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-label="Fiverr"
    className={className}
    focusable="false"
  >
    <circle cx="12" cy="12" r="12" fill="#000" />
    <text
      x="50%"
      y="53%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="13.5"
      fontWeight="800"
      fill="#fff"
      fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
      letterSpacing="-0.5"
    >
      fi
    </text>
  </svg>
);
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// ----- Strong types for local state -----
type PaymentStatus = 'paid' | 'pending';
type PaymentMethod = '' | 'paypal' | 'venmo' | 'cashapp' | 'bank';
interface PaymentHistoryItem { id: number; date: string; description: string; amount: string; status: PaymentStatus }
interface ExperienceItem { title: string; company: string; duration?: string; description?: string }
interface PortfolioItem { id: number; title: string; description?: string; link?: string; imageUrl?: string }
interface PlatformLinks { linkedin: string; github: string; upwork: string; fiverr: string }
interface PaymentsState {
  method: PaymentMethod;
  paypalEmail: string;
  venmo: string;
  cashapp: string;
  bankLast4: string;
  taxW9Submitted: boolean;
  history: PaymentHistoryItem[];
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
  platformLinks: PlatformLinks;
  payments: PaymentsState;
}

const StudentProfile = () => {
  // --- Skills state and handlers ---
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

  // --- Experience state and handlers ---
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

  // --- Portfolio state and handlers ---
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
  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const canEdit = !id || (currentUserId && id === currentUserId);
  const [isEditing, setIsEditing] = useState(false);
  const initialStudent: StudentState = {
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    location: '',
    bio: '',
    skills: [] as string[],
    experience: [] as ExperienceItem[],
    portfolio: [] as PortfolioItem[],
    platformLinks: { linkedin: '', github: '', upwork: '', fiverr: '' },
    payments: {
      method: '' as PaymentMethod,
      paypalEmail: '',
      venmo: '',
      cashapp: '',
      bankLast4: '',
      taxW9Submitted: false,
      history: [
        { id: 1, date: '2024-08-15', description: 'Project payout', amount: '$250.00', status: 'paid' },
        { id: 2, date: '2024-08-02', description: 'Milestone payment', amount: '$120.00', status: 'paid' },
        { id: 3, date: '2024-07-28', description: 'Invoice #1042', amount: '$75.00', status: 'pending' },
      ],
    },
  };
  const [student, setStudent] = useState<StudentState>(initialStudent);
  const [edited, setEdited] = useState<StudentState>(initialStudent);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerAvatarPick = () => fileInputRef.current?.click();
  const handleAvatarChange = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setEdited({ ...edited, avatarUrl: String(reader.result || '') });
    reader.readAsDataURL(file);
  };
  const removeAvatar = () => setEdited({ ...edited, avatarUrl: '' });

  const handleSave = () => {
    setStudent(edited);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEdited(student);
    setIsEditing(false);
  };

  // Prefill from Supabase profile (signup/waitlist info) or mock data for viewing other students
  useEffect(() => {
    // get currently authenticated user id for edit permissions and prefill profile
    (async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        setCurrentUserId(userRes?.user?.id || null);
        const uid = userRes?.user?.id;
        
        // If we have an ID in the URL, we're viewing another student's profile
        if (id && id !== uid) {
          // Find the student in mock data
          const mockStudent = mockStudents.find(s => s.id === parseInt(id));
          if (mockStudent) {
            const studentData: StudentState = {
              name: mockStudent.name,
              email: mockStudent.contact?.email || '',
              phone: mockStudent.contact?.phone || '',
              avatarUrl: mockStudent.avatarUrl || '',
              location: '', // Not available in mock data
              bio: mockStudent.aboutMe || mockStudent.description,
              skills: mockStudent.skills || [],
              experience: [], // Not available in mock data
              portfolio: mockStudent.portfolio?.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                link: p.link,
                imageUrl: p.imageUrl
              })) || [],
              platformLinks: {
                linkedin: mockStudent.contact?.linkedinUrl || '',
                github: mockStudent.contact?.githubUrl || '',
                upwork: mockStudent.contact?.upworkUrl || '',
                fiverr: mockStudent.contact?.fiverrUrl || ''
              },
              payments: {
                method: '' as PaymentMethod,
                paypalEmail: '',
                venmo: '',
                cashapp: '',
                bankLast4: '',
                taxW9Submitted: false,
                history: [],
              },
            };
            setStudent(studentData);
            setEdited(studentData);
          }
          return;
        }
        
        // Otherwise, load current user's profile
        if (!uid) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name,last_name,display_name,email')
          .eq('user_id', uid)
          .maybeSingle();
        if (!error && data) {
          const name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || data.display_name || '';
          setStudent(prev => ({ ...prev, name, email: data.email || '' }));
          setEdited(prev => ({ ...prev, name, email: data.email || '' }));
        }
      } catch (e) {
        setCurrentUserId(null);
      }
    })();
  }, [id]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={canEdit ? "My Profile" : `${student.name}'s Profile`}
        description={canEdit ? "Manage your profile information and settings" : "View student profile and information"}
      >
        <div className="flex gap-2">
          {canEdit && <Button variant="outline" size="default"><Eye className="mr-2 h-4 w-4" /> Preview Profile</Button>}
          {canEdit && (!isEditing ? (
            <Button size="default" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
          ) : (
            <>
              {canEdit && (
                <>
                  <Button onClick={handleSave}><span className="mr-2">Save</span></Button>
                  <Button variant="outline" onClick={handleCancel}><span className="mr-2">Cancel</span></Button>
                </>
              )}
            </>
          ))}
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
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  {/* Edit layout (compact form grid) */}
                  <div className="grid grid-cols-1 gap-4 items-center">
                    <div className="flex justify-start">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleAvatarChange(e.target.files?.[0] || null)}
                      />
                      <div className="relative inline-block">
                        {edited.avatarUrl ? (
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={edited.avatarUrl} alt={edited.name} />
                          </Avatar>
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="text-white" size={28} />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={triggerAvatarPick}
                          aria-label="Change photo"
                          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full border bg-background shadow hover:bg-secondary flex items-center justify-center"
                        >
                          <Image className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {edited.avatarUrl && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="ml-3 text-xs text-muted-foreground hover:text-red-600"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="min-h-[72px] flex flex-col justify-start">
                        <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                        <Input className="mt-1 h-9" value={edited.name} onChange={(e)=>setEdited({...edited, name: e.target.value})} placeholder="Your full name" />
                      </div>
                      <div className="min-h-[72px] flex flex-col justify-start">
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <Input className="mt-1 h-9" type="email" value={edited.email} onChange={(e)=>setEdited({...edited, email: e.target.value})} placeholder="name@example.com" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="min-h-[72px] flex flex-col justify-start">
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <Input className="mt-1 h-9" value={edited.phone} onChange={(e)=>setEdited({...edited, phone: e.target.value})} placeholder="(555) 123-4567" />
                      </div>
                      <div className="min-h-[72px] flex flex-col justify-start">
                        <div className="text-sm font-medium text-muted-foreground">Location</div>
                        <Input className="mt-1 h-9" value={edited.location} onChange={(e)=>setEdited({...edited, location: e.target.value})} placeholder="City, Country" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Bio</div>
                      <Textarea rows={2} className="resize-none text-sm" value={edited.bio} onChange={(e)=>setEdited({...edited, bio: e.target.value})} placeholder="Tell us about yourself" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* View layout like the screenshot */}
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="flex items-start gap-4">
                      {student.avatarUrl ? (
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={student.avatarUrl} alt={student.name} />
                        </Avatar>
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <User className="text-white" size={28} />
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                          <div className="text-base font-semibold">{student.name || '—'}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Email</div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail size={16} />
                            <span>{student.email || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone size={16} />
                          <span>{student.phone || '—'}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Location</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={16} />
                          <span>{student.location || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Bio</div>
                    <p className="text-muted-foreground text-sm">{student.bio || '—'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Experience */}
        <TabsContent value="skills">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Technologies and tools you use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(edited.skills || []).map((skill) => (
                    <div key={skill} className="flex items-center gap-1">
                      <Badge>{skill}</Badge>
                      {isEditing && (
                        <Button size="sm" variant="ghost" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e)=>setNewSkill(e.target.value)}
                      className="h-9 max-w-xs"
                    />
                    <Button variant="outline" className="h-9 px-3" onClick={addSkill}>
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Your recent roles and projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {edited.experience.length === 0 && !isEditing && (
                  <p className="text-sm text-muted-foreground">No experience added yet.</p>
                )}
                {edited.experience.map((exp, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 border border-border/60 rounded-lg p-3">
                    <div>
                      <div className="font-medium">{exp.title}</div>
                      <div className="text-sm text-muted-foreground">{exp.company} {exp.duration ? `• ${exp.duration}` : ''}</div>
                      {exp.description && <div className="text-sm mt-1 text-muted-foreground">{exp.description}</div>}
                    </div>
                    {isEditing && (
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={()=>removeExperience(idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <Input placeholder="Title" value={newExp.title} onChange={(e)=>setNewExp({...newExp, title: e.target.value})} />
                    <Input placeholder="Company" value={newExp.company} onChange={(e)=>setNewExp({...newExp, company: e.target.value})} />
                    <Input placeholder="Duration (optional)" value={newExp.duration} onChange={(e)=>setNewExp({...newExp, duration: e.target.value})} />
                    <Button onClick={addExperience}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                    <div className="md:col-span-4">
                      <Input placeholder="Short description (optional)" value={newExp.description} onChange={(e)=>setNewExp({...newExp, description: e.target.value})} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfolio */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Showcase your best work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {edited.portfolio.length === 0 && !isEditing && (
                <p className="text-sm text-muted-foreground">No portfolio items yet.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {edited.portfolio.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/60 p-3">
                    <div className="font-medium">{item.title}</div>
                    {item.description && <div className="text-sm text-muted-foreground mt-1">{item.description}</div>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary mt-2">
                        <ExternalLink className="h-3 w-3" /> View
                      </a>
                    )}
                    {isEditing && (
                      <div className="mt-2">
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={()=>removePortfolio(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <Input placeholder="Title" value={newPortfolio.title} onChange={(e)=>setNewPortfolio({...newPortfolio, title: e.target.value})} />
                  <Input placeholder="Link (optional)" value={newPortfolio.link} onChange={(e)=>setNewPortfolio({...newPortfolio, link: e.target.value})} />
                  <Button onClick={addPortfolio}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                  <div className="md:col-span-3">
                    <Input placeholder="Short description (optional)" value={newPortfolio.description} onChange={(e)=>setNewPortfolio({...newPortfolio, description: e.target.value})} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connections */}
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Platform Connections</CardTitle>
              <CardDescription>Link your professional profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</label>
                  {isEditing ? (
                    <Input placeholder="https://linkedin.com/in/username" value={edited.platformLinks.linkedin || ''} onChange={(e)=>setEdited({...edited, platformLinks: { ...edited.platformLinks, linkedin: e.target.value }})} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{edited.platformLinks.linkedin || 'Not connected'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</label>
                  {isEditing ? (
                    <Input placeholder="https://github.com/username" value={edited.platformLinks.github || ''} onChange={(e)=>setEdited({...edited, platformLinks: { ...edited.platformLinks, github: e.target.value }})} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{edited.platformLinks.github || 'Not connected'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><UpworkIcon className="h-4 w-4" /> Upwork</label>
                  {isEditing ? (
                    <Input placeholder="https://upwork.com/freelancers/username" value={edited.platformLinks.upwork || ''} onChange={(e)=>setEdited({...edited, platformLinks: { ...edited.platformLinks, upwork: e.target.value }})} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{edited.platformLinks.upwork || 'Not connected'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><FiverrIcon className="h-4 w-4" /> Fiverr</label>
                  {isEditing ? (
                    <Input placeholder="https://fiverr.com/username" value={edited.platformLinks.fiverr || ''} onChange={(e)=>setEdited({...edited, platformLinks: { ...edited.platformLinks, fiverr: e.target.value }})} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{edited.platformLinks.fiverr || 'Not connected'}</p>
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

export default StudentProfile;
