



import React, { useRef, useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Eye, Edit, Image, User, Linkedin, Github } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


const ClientProfile = () => {
  const { role } = useRole();
  // Treat developer as client for this page
  const effectiveRole = role === 'developer' ? 'client' : role;
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    location: '',
    bio: '',
    platformLinks: { linkedin: '', github: '', upwork: '', fiverr: '' },
    payments: {
      method: '',
      paypalEmail: '',
      venmo: '',
      cashapp: '',
      bankLast4: '',
    },
  });
  const [edited, setEdited] = useState(client);
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
    setClient(edited);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEdited(client);
    setIsEditing(false);
  };

  // Only allow interaction if effectiveRole is 'client'
  const canEdit = effectiveRole === 'client';

  // Prefill from Supabase profile (signup/waitlist info)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const uid = userRes?.user?.id;
        if (!uid) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name,last_name,display_name,email,avatar_url,bio')
          .eq('user_id', uid)
          .maybeSingle();
        if (error || !data) return;

        const name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || data.display_name || '';
        const next = {
          name,
          email: data.email || '',
          phone: '',
          avatarUrl: data.avatar_url || '',
          location: '',
          bio: data.bio || '',
          platformLinks: { linkedin: '', github: '', upwork: '', fiverr: '' },
          payments: {
            method: '',
            paypalEmail: '',
            venmo: '',
            cashapp: '',
            bankLast4: '',
          },
        };
        setClient(next);
        setEdited(next);
      } catch (e) {
        console.warn('Failed to load client profile:', e);
      }
    };
    loadProfile();
  }, []);

  // Monochrome brand icons to match LinkedIn/GitHub style
  const UpworkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" role="img" aria-label="Upwork" className={className} focusable="false">
      <circle cx="12" cy="12" r="12" fill="#000" />
      <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle" fontSize="13.5" fontWeight="800" fill="#fff" fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">Up</text>
    </svg>
  );
  const FiverrIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" role="img" aria-label="Fiverr" className={className} focusable="false">
      <circle cx="12" cy="12" r="12" fill="#000" />
      <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle" fontSize="13.5" fontWeight="800" fill="#fff" fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" letterSpacing="-0.5">fi</text>
    </svg>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your profile information and settings"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="default"><Eye className="mr-2 h-4 w-4" /> Preview Profile</Button>
          {canEdit && (!isEditing ? (
            <Button size="default" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
          ) : (
            <>
              <Button onClick={handleSave}><span className="mr-2">Save</span></Button>
              <Button variant="outline" onClick={handleCancel}><span className="mr-2">Cancel</span></Button>
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
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {canEdit && isEditing ? (
                <>
                  {/* Edit layout (compact form grid) */}
                  <div className="grid grid-cols-1 gap-4 items-center">
                    <div className="flex justify-start">
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleAvatarChange(e.target.files?.[0] || null)} />
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
                        <button type="button" onClick={triggerAvatarPick} aria-label="Change photo" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full border bg-background shadow hover:bg-secondary flex items-center justify-center">
                          <Image className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {edited.avatarUrl && (
                        <button type="button" onClick={removeAvatar} className="ml-3 text-xs text-muted-foreground hover:text-red-600">Remove photo</button>
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
                  {/* View layout to match StudentProfile */}
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="flex items-start gap-4">
                      {client.avatarUrl ? (
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={client.avatarUrl} alt={client.name} />
                        </Avatar>
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <User className="text-white" size={28} />
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                          <div className="text-base font-semibold">{client.name || '—'}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Email</div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail size={16} />
                            <span>{client.email || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone size={16} />
                          <span>{client.phone || '—'}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Location</div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={16} />
                          <span>{client.location || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Bio</div>
                    <p className="text-muted-foreground text-sm">{client.bio || '—'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
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
                  {canEdit && isEditing ? (
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={edited.platformLinks.linkedin}
                      onChange={(e)=>setEdited({ ...edited, platformLinks: { ...edited.platformLinks, linkedin: e.target.value } })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{client.platformLinks.linkedin || 'Not connected'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</label>
                  {canEdit && isEditing ? (
                    <Input
                      placeholder="https://github.com/username"
                      value={edited.platformLinks.github}
                      onChange={(e)=>setEdited({ ...edited, platformLinks: { ...edited.platformLinks, github: e.target.value } })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{client.platformLinks.github || 'Not connected'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><UpworkIcon className="h-4 w-4" /> Upwork</label>
                  {canEdit && isEditing ? (
                    <Input
                      placeholder="https://upwork.com/freelancers/username"
                      value={edited.platformLinks.upwork}
                      onChange={(e)=>setEdited({ ...edited, platformLinks: { ...edited.platformLinks, upwork: e.target.value } })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{client.platformLinks.upwork || 'Not connected'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2"><FiverrIcon className="h-4 w-4" /> Fiverr</label>
                  {canEdit && isEditing ? (
                    <Input
                      placeholder="https://fiverr.com/username"
                      value={edited.platformLinks.fiverr}
                      onChange={(e)=>setEdited({ ...edited, platformLinks: { ...edited.platformLinks, fiverr: e.target.value } })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{client.platformLinks.fiverr || 'Not connected'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Other tabs can be filled in as needed */}
      </Tabs>
    </div>
  );
};

export default ClientProfile;
