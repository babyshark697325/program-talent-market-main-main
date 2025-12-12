import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Eye, Edit, Image, User, X, Plus, Trash2, ExternalLink, Linkedin, Github, Briefcase, MessageCircle, Star, FolderOpen, CheckCircle, Clock, Globe, Shield, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/data/mockStudents';
import { mockReviews } from '@/data/mockReviews';

// Brand icons for platform links (prefer official SVGs in /public/brands, fallback to colored badge)
const UpworkIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.077.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703 0 1.491-1.211 2.703-2.704 2.703zm0-7.347c-2.548 0-4.63 2.082-4.63 4.63 0 .639.132 1.25.37 1.81l-1.666-4.214H9.72l2.316 5.867c-2.454.773-4.195 1.549-4.708 1.821C6.918 10.237 7.051 6.848 7.051 5.81c0-1.895-.88-3.06-2.529-3.06C2.698 2.75 1.76 4.316 1.76 6.864v9.33h1.927V6.865c0-1.499.502-2.188 1.408-2.188.8 0 1.127.818 1.127 2.188v9.33h1.926v-1.926c.39-.181 2.301-1.025 5.093-1.93l-1.04 2.625 1.713 1.232 2.39-6.035c.749.61 1.62.964 2.502.964 2.548 0 4.63-2.082 4.63-4.63 0-2.547-2.082-4.629-4.63-4.629z" />
  </svg>
);

const FiverrIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" className="fill-current opacity-20" />
    <path d="M17.5 13.5V9.5h-1.3v4h-1.4V9.5h-1.3V11c0 1.1-.9 2-2 2h-.8v.5h3.4v1.3H10v-3.7c0-1.1.9-2 2-2h1.6V7.8h-4.3v5.7h1.4v-1.2h.7c.3 0 .5-.2.5-.5V11c0-.3-.2-.5-.5-.5h-.7V9.5h1.7c.3 0 .5-.2.5-.5V7.8h-5.2v8.5H19v-2.8h-1.5z" />
  </svg>
);

import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  title: string;
  price: string;
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
  const fallbackStudent = useMemo(() => {
    if (id) {
      return (
        mockStudents.find(
          (s) => s.cic_id === id || String(s.id) === String(id),
        ) || mockStudents[0]
      );
    }
    return mockStudents[0];
  }, [id]);
  const defaultRate = '$25/hr';
  const initialStudent: StudentState = {
    name: fallbackStudent?.name || 'Alex Rivera',
    email: fallbackStudent?.contact?.email || 'alex@example.com',
    phone: fallbackStudent?.contact?.phone || '(555) 123-4567',
    avatarUrl: fallbackStudent?.avatarUrl || '',
    location: 'San Francisco, CA',
    title: fallbackStudent?.title || 'Student Developer',
    price: defaultRate,
    bio: fallbackStudent?.aboutMe || fallbackStudent?.description || 'Tell clients what you do best and what kind of work excites you.',
    skills: fallbackStudent?.skills || ['React', 'TypeScript', 'Node.js'],
    experience: [] as ExperienceItem[],
    portfolio: fallbackStudent?.portfolio?.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      link: p.link,
      imageUrl: p.imageUrl,
    })) || [],
    platformLinks: {
      linkedin: fallbackStudent?.contact?.linkedinUrl || '',
      github: fallbackStudent?.contact?.githubUrl || '',
      upwork: fallbackStudent?.contact?.upworkUrl || '',
      fiverr: fallbackStudent?.contact?.fiverrUrl || '',
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
  const [student, setStudent] = useState<StudentState>(initialStudent);
  const [edited, setEdited] = useState<StudentState>(initialStudent);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayStudent = isEditing ? edited : student;

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

  const handleHire = () => {
    console.log('Hire student:', student.name);
    // TODO: Implement hire flow
  };

  const handleContact = () => {
    console.log('Contact student:', student.name);
    // TODO: Implement contact flow
  };

  // Prefill from Supabase profile (signup/waitlist info) or mock data for viewing other students
  useEffect(() => {
    // get currently authenticated user id for edit permissions and prefill profile
    (async () => {
      setLoading(true);
      try {
        const { data: userRes } = await supabase.auth.getUser();
        setCurrentUserId(userRes?.user?.id || null);
        const uid = userRes?.user?.id;

        // If we have an ID in the URL, we're viewing another student's profile
        if (id && id !== uid) {
          let studentData: StudentState | null = null;
          // 1. Try to find in 'profiles' (registered users)
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', id)
            .maybeSingle();

          if (profileData) {
            const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ').trim();
            studentData = {
              name: fullName || profileData.display_name || 'Unnamed Student',
              email: profileData.email || '',
              phone: '', // profiles table might not have phone exposed or distinct col
              avatarUrl: profileData.avatar_url || '',
              location: profileData.city || profileData.location || 'San Francisco, CA', // Fallback location if missing
              title: profileData.title || 'Student',
              price: profileData.hourly_rate || '$25/hr', // Map snake_case if needed, assuming col exists or defaults
              bio: profileData.bio || profileData.description || '',
              skills: profileData.skills || [],
              experience: [], // functionality to fetch experience table needed later?
              portfolio: [],
              platformLinks: { linkedin: '', github: '', upwork: '', fiverr: '' },
              payments: { ...initialStudent.payments, history: [] },
            };
          }

          // 2. If not found, try 'prelaunch_signups' (waitlist)
          if (!studentData) {
            const isNumericId = /^\d+$/.test(id);
            const identifierColumn = isNumericId ? 'id' : 'cic_id';
            const identifierValue = isNumericId ? Number(id) : id;
            const { data: waitlistData } = await supabase
              .from('prelaunch_signups')
              .select('*')
              .eq(identifierColumn, identifierValue)
              .maybeSingle();

            if (waitlistData) {
              const waitlistName = [waitlistData.first_name, waitlistData.last_name].filter(Boolean).join(' ').trim();
              studentData = {
                name: waitlistName || waitlistData.display_name || waitlistData.name || (waitlistData.email ? waitlistData.email.split('@')[0] : 'Unnamed Student'),
                email: waitlistData.email || '',
                phone: waitlistData.phone || '',
                avatarUrl: waitlistData.avatar_url || '',
                location: waitlistData.city || waitlistData.location || 'San Francisco, CA',
                title: waitlistData.title || '',
                price: waitlistData.price || '$25/hr',
                bio: waitlistData.aboutMe || waitlistData.description || '',
                skills: waitlistData.skills || [],
                experience: [],
                portfolio: waitlistData.portfolio?.map((p: PortfolioItem) => ({
                  id: p.id,
                  title: p.title,
                  description: p.description,
                  link: p.link,
                  imageUrl: (p as any).imageUrl,
                })) || [],
                platformLinks: {
                  linkedin: waitlistData.contact?.linkedinUrl || '',
                  github: waitlistData.contact?.githubUrl || '',
                  upwork: waitlistData.contact?.upworkUrl || '',
                  fiverr: waitlistData.contact?.fiverrUrl || '',
                },
                payments: { ...initialStudent.payments, history: [] },
              };
            }
          }

          if (!studentData) {
            const mockStudent = mockStudents.find(
              (s) => s.cic_id === id || String(s.id) === String(id),
            );
            if (mockStudent) {
              studentData = {
                name: mockStudent.name,
                email: mockStudent.contact?.email || '',
                phone: mockStudent.contact?.phone || '',
                avatarUrl: mockStudent.avatarUrl || '',
                location: mockStudent.location || 'San Francisco, CA',
                title: mockStudent.title || '',
                price: mockStudent.price || '',
                bio: mockStudent.aboutMe || mockStudent.description,
                skills: mockStudent.skills || [],
                experience: [],
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
            }
          }

          if (studentData) {
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
          const name =
            [data.first_name, data.last_name].filter(Boolean).join(' ').trim() ||
            data.display_name ||
            (data.email ? data.email.split('@')[0] : '');
          setStudent(prev => ({ ...prev, name, email: data.email || '' }));
          setEdited(prev => ({ ...prev, name, email: data.email || '' }));
        }
      } catch (e) {
        setCurrentUserId(null);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [id]);

  // --- Additional Icons ---

  if (loading) {
    return (
      <div className="container mx-auto p-6 md:p-8 max-w-7xl min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 max-w-7xl animate-in fade-in duration-500 bg-muted/20 min-h-screen">

      {/* 1. TOP PROFILE HEADER CARD */}
      <Card className="mb-6 border-none shadow-sm bg-card overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center relative">

          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-6 flex-1">
            <div className="relative group shrink-0">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md">
                <AvatarImage src={displayStudent.avatarUrl} className="object-cover" />
                <AvatarFallback className="text-2xl">{displayStudent.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" onClick={triggerAvatarPick}>
                  <Image className="h-6 w-6" />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleAvatarChange(e.target.files?.[0])} />
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              {isEditing ? (
                <>
                  <Input value={edited.name} onChange={e => setEdited({ ...edited, name: e.target.value })} className="font-bold text-2xl h-10 w-full max-w-md" placeholder="Full Name" />
                  <Input value={edited.title} onChange={e => setEdited({ ...edited, title: e.target.value })} className="text-muted-foreground h-9 w-full max-w-md" placeholder="Professional Title" />
                  <Input value={edited.location} onChange={e => setEdited({ ...edited, location: e.target.value })} className="h-8 w-64" placeholder="Location" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-foreground">{displayStudent.name}</h1>
                  <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                    {displayStudent.title || 'Freelancer'}
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mx-2" />
                    <span className="text-sm font-normal flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {displayStudent.location}</span>
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-foreground bg-accent/50 px-3 py-1 rounded-full">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {isEditing ? <Input value={edited.email} onChange={e => setEdited({ ...edited, email: e.target.value })} className="h-6 w-40 text-xs bg-transparent border-none p-0 focus-visible:ring-0" /> : (displayStudent.email || 'Email hidden')}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-foreground bg-accent/50 px-3 py-1 rounded-full">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {isEditing ? <Input value={edited.phone} onChange={e => setEdited({ ...edited, phone: e.target.value })} className="h-6 w-32 text-xs bg-transparent border-none p-0 focus-visible:ring-0" /> : (displayStudent.phone || 'Phone hidden')}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats & Actions (Right Side) */}
          <div className="flex flex-col items-end gap-6 min-w-[240px]">

            {/* Edit/Action Buttons */}
            <div className="flex gap-3">
              {canEdit ? (
                <>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                  ) : (
                    <>
                      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSave}><CheckCircle className="mr-2 h-4 w-4" /> Save</Button>
                      <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">Hire Now</Button>
                  <Button size="sm" variant="outline">Message</Button>
                </>
              )}
            </div>

            {/* Performance Stats Row */}
            <div className="flex items-center gap-8 bg-muted/30 px-6 py-3 rounded-xl border border-border/50">
              <div className="text-center">
                <div className="text-sm text-muted-foreground font-medium mb-1">Job Success</div>
                <div className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                  100% <Badge variant="secondary" className="h-4 px-1 rounded-full bg-accent/20 text-accent-foreground text-[10px]"><Star className="w-2.5 h-2.5 fill-current" /></Badge>
                </div>
              </div>
              <div className="w-px h-8 bg-border/60" />
              <div className="text-center">
                <div className="text-sm text-muted-foreground font-medium mb-1">Hourly Rate</div>
                <div className="text-lg font-bold text-foreground">
                  {isEditing ? <div className="flex items-center gap-1">$<Input value={edited.price} onChange={e => setEdited({ ...edited, price: e.target.value })} className="h-6 w-16 text-center p-0" /></div> : (displayStudent.price || '$25/hr')}
                </div>
              </div>
              <div className="w-px h-8 bg-border/60" />
              <div className="text-center">
                <div className="text-sm text-muted-foreground font-medium mb-1">Total Earned</div>
                <div className="text-lg font-bold text-foreground">
                  ${displayStudent.payments.history
                    .filter(p => p.status === 'paid')
                    .reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0), 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. MAIN LAYOUT: TABS & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* LEFT MAIN CONTENT (Tabs) */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-border p-0 h-auto rounded-none gap-6 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted/10 data-[state=active]:shadow-none rounded-t-md py-3 px-4 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all">Overview</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted/10 data-[state=active]:shadow-none rounded-t-md py-3 px-4 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all">Skills & Expertise</TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted/10 data-[state=active]:shadow-none rounded-t-md py-3 px-4 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all">Portfolio</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted/10 data-[state=active]:shadow-none rounded-t-md py-3 px-4 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all">Work History</TabsTrigger>
            </TabsList>

            {/* TAB: OVERVIEW */}
            <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Overview</h3>
                {isEditing ? (
                  <Textarea rows={6} value={edited.bio} onChange={e => setEdited({ ...edited, bio: e.target.value })} className="text-base leading-relaxed bg-background" placeholder="Write a compelling bio..." />
                ) : (
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{displayStudent.bio}</p>
                )}
              </div>

              {/* Connected Accounts & Languages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Linked Accounts</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'LinkedIn', icon: Linkedin, key: 'linkedin', color: 'text-[#0077b5]' },
                      { label: 'GitHub', icon: Github, key: 'github', color: 'text-foreground' },
                      { label: 'Upwork', icon: UpworkIcon, key: 'upwork', color: 'text-[#14a800]' },
                      { label: 'Fiverr', icon: FiverrIcon, key: 'fiverr', color: 'text-[#1dbf73]' }
                    ].map(platform => (
                      <div key={platform.key} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <platform.icon className={`w-5 h-5 ${platform.color}`} />
                          <span className="text-sm font-medium">{platform.label}</span>
                        </div>
                        {isEditing ? (
                          <Input className="h-8 w-36 text-xs" placeholder="URL..." value={(edited.platformLinks as any)[platform.key] || ''} onChange={e => setEdited({ ...edited, platformLinks: { ...edited.platformLinks, [platform.key]: e.target.value } })} />
                        ) : (
                          (displayStudent.platformLinks as any)[platform.key] ? (
                            <a href={(displayStudent.platformLinks as any)[platform.key]} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">Verified <CheckCircle className="w-3 h-3" /></a>
                          ) : <span className="text-xs text-muted-foreground italic">Not Linked</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Languages</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">English</span>
                      <span className="font-medium text-foreground">Native or Bilingual</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Spanish</span>
                      <span className="font-medium text-foreground">Conversational</span>
                    </div>
                    {isEditing && <Button variant="ghost" size="sm" className="w-full text-xs mt-2"><Plus className="w-3 h-3 mr-1" /> Add Language</Button>}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB: SKILLS */}
            <TabsContent value="skills" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Skills Assessment</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {(edited.skills || []).map((skill, i) => (
                    <div key={skill} className="flex flex-col gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{skill}</span>
                        {isEditing && <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeSkill(skill)}><X className="h-3 w-3" /></Button>}
                      </div>
                      <div className="flex gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 text-muted/30" />
                        <span className="text-xs text-muted-foreground ml-2 font-medium">4.0</span>
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
                      <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add new skill..." className="h-9 bg-transparent border-none focus-visible:ring-0" onKeyDown={e => e.key === 'Enter' && addSkill()} />
                      <Button size="sm" variant="ghost" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB: PORTFOLIO */}
            <TabsContent value="portfolio" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h3 className="text-lg font-semibold">Portfolio & Projects</h3>
                {isEditing && <Button size="sm" onClick={addPortfolio}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {edited.portfolio.map(item => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-all border-border">
                    <div className="aspect-video bg-muted relative">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full text-muted-foreground"><Image className="h-10 w-10 opacity-20" /></div>}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">STARTING AT $500</div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      {isEditing ? (
                        <>
                          <Input value={item.title} onChange={e => {
                            const arr = [...edited.portfolio]; const idx = arr.findIndex(p => p.id === item.id); if (idx >= 0) arr[idx].title = e.target.value; setEdited({ ...edited, portfolio: arr });
                          }} className="font-bold h-8" />
                          <Textarea value={item.description} onChange={e => {
                            const arr = [...edited.portfolio]; const idx = arr.findIndex(p => p.id === item.id); if (idx >= 0) arr[idx].description = e.target.value; setEdited({ ...edited, portfolio: arr });
                          }} rows={2} className="text-xs" />
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-foreground truncate">{item.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{item.description}</div>
                        </>
                      )}
                      {isEditing && <Button variant="destructive" size="sm" className="w-full mt-2 h-7 text-xs" onClick={() => removePortfolio(item.id)}>Remove</Button>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB: WORK HISTORY */}
            <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Employment History</h3>
                <div className="space-y-6">
                  {(edited.experience || []).map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {exp.company?.charAt(0) || 'C'}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-foreground">{exp.title}</h4>
                          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">{exp.duration || '2023 - Present'}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                        {isEditing && <Button variant="link" className="h-auto p-0 text-destructive text-xs mt-1" onClick={() => removeExperience(i)}>Remove Entry</Button>}
                      </div>
                    </div>
                  ))}
                  {isEditing && <div className="text-center pt-4 border-t"><Button variant="outline" onClick={addExperience}><Plus className="mr-2 h-4 w-4" /> Add Employment</Button></div>}
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>


        {/* RIGHT SIDEBAR (Sticky) */}
        <div className="lg:col-span-1 space-y-6">

          {/* Current Status Widget */}
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-3 bg-muted/30 rounded-t-xl">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Current Status</span>
                <Badge variant="outline" className="bg-background text-[10px]">Available Now</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4 relative pl-4 border-l-2 border-primary/20">
                {[
                  { status: 'Available', time: 'Now', current: true },
                  { status: 'In Design Review', time: '2d ago', current: false },
                  { status: 'Completed Project', time: '1w ago', current: false }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-card ${item.current ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    <div className={`text-sm font-medium ${item.current ? 'text-foreground' : 'text-muted-foreground'}`}>{item.status}</div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* 3. REVIEWS GRID (Bottom) */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-bold text-foreground">Client Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReviews.filter(r => r.targetType === 'student').map(review => (
            <Card key={review.id} className="border-none shadow-sm bg-card hover:shadow-md transition-all h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={review.reviewerAvatar} />
                    <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{review.reviewerName}</div>
                    <div className="text-xs text-muted-foreground">Verified Client</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed flex-1">
                  "{review.comment}"
                </div>
                <div className="pt-4 border-t border-border flex items-center gap-4 mt-auto">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-foreground ml-1">5.0</span>
                  </div>
                  <div className="text-xs text-muted-foreground">2 weeks ago</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
