import React, { useRef, useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Eye, Edit, Image, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const ClientProfile = () => {
  const handleSave = () => {
    setClient(edited);
    setIsEditing(false);
  };

  const removeAvatar = () => setEdited({ ...edited, avatarUrl: '' });
  const { role } = useRole();
  const effectiveRole = role === 'developer' ? 'client' : role;
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    location: '',
    bio: '',
    businessName: '',
    industry: '',
    businessDescription: '',
    platformLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
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
  // Removed duplicate imports
  // import { Button } from "@/components/ui/button";
  // import { Input } from "@/components/ui/input";
  // import { Textarea } from "@/components/ui/textarea";
  // import { Label } from "@/components/ui/label";
  // import { Building2, Globe, Phone, Mail, Edit, Save, X } from "lucide-react";
  // import { useToast } from "@/components/ui/use-toast";
  };
  const handleCancel = () => {
    setEdited(client);
    setIsEditing(false);
  };

  const canEdit = effectiveRole === 'client';

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
          businessName: '',
          industry: '',
          businessDescription: '',
              platformLinks: {
                linkedin: '',
                twitter: '',
                facebook: '',
                instagram: '',
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
          <TabsTrigger value="business">Business Profile</TabsTrigger>
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
              {canEdit && isEditing ? (
                <>
                  <div className="grid grid-cols-1 gap-4 items-center">
                    <div className="flex justify-start">
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleAvatarChange(e.target.files?.[0] || null)} />
                      <div className="relative inline-block">
                        <Avatar className="h-16 w-16">
                          {edited.avatarUrl ? (
                            <AvatarImage src={edited.avatarUrl} alt={edited.name} />
                          ) : null}
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                            <User size={28} />
                          </AvatarFallback>
                        </Avatar>
                      <button type="button" onClick={triggerAvatarPick} aria-label="Change photo" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full border bg-background shadow hover:bg-secondary flex items-center justify-center">
                        <Image className="h-3.5 w-3.5" />
                      </button>
                      </div>
                      {edited.avatarUrl && (
                        <button type="button" onClick={removeAvatar} className="ml-3 text-xs text-muted-foreground hover:text-red-600">Remove photo</button>
                      )}
                    </div>

                  {/* End avatar/photo section */}
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
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      {client.avatarUrl ? (
                        <AvatarImage src={client.avatarUrl} alt={client.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        <User size={28} />
                      </AvatarFallback>
                    </Avatar>
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
      {/* Business Profile Card */}
      <TabsContent value="business">
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {canEdit && isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Business Name</label>
                  <Input
                    value={edited.businessName || ''}
                    onChange={e => setEdited({ ...edited, businessName: e.target.value })}
                    placeholder="Your business name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Industry</label>
                  <Input
                    value={edited.industry || ''}
                    onChange={e => setEdited({ ...edited, industry: e.target.value })}
                    placeholder="Industry or sector"
                    className="h-10"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={edited.location || ''}
                    onChange={e => setEdited({ ...edited, location: e.target.value })}
                    placeholder="Business location"
                    className="h-10"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">About</label>
                  <Textarea
                    value={edited.businessDescription || ''}
                    onChange={e => setEdited({ ...edited, businessDescription: e.target.value })}
                    placeholder="Company description & mission"
                    rows={4}
                    className="resize-none text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Business Name:</span>
                  <span className="ml-2">{client.businessName || 'Acme, Inc.'}</span>
                </div>
                <div>
                  <span className="font-medium">Industry:</span>
                  <span className="ml-2">{client.industry || 'Design & Marketing'}</span>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{client.location || 'Miami, FL'}</span>
                </div>
                <div className="md:col-span-2 mt-2">
                  <span className="font-medium">About:</span>
                  <span className="ml-2">{client.businessDescription || 'Company description & mission not provided.'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      {/* Connections Card */}
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
                  <Input placeholder="https://linkedin.com/in/username" value={edited.platformLinks.linkedin || ''} onChange={e => setEdited({ ...edited, platformLinks: { ...edited.platformLinks, linkedin: e.target.value } })} />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.platformLinks?.linkedin || 'Not connected'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter</label>
                {canEdit && isEditing ? (
                  <Input placeholder="https://twitter.com/username" value={edited.platformLinks.twitter || ''} onChange={e => setEdited({ ...edited, platformLinks: { ...edited.platformLinks, twitter: e.target.value } })} />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.platformLinks?.twitter || 'Not connected'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook</label>
                {canEdit && isEditing ? (
                  <Input placeholder="https://facebook.com/username" value={edited.platformLinks.facebook || ''} onChange={e => setEdited({ ...edited, platformLinks: { ...edited.platformLinks, facebook: e.target.value } })} />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.platformLinks?.facebook || 'Not connected'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</label>
                {canEdit && isEditing ? (
                  <Input placeholder="https://instagram.com/username" value={edited.platformLinks.instagram || ''} onChange={e => setEdited({ ...edited, platformLinks: { ...edited.platformLinks, instagram: e.target.value } })} />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.platformLinks?.instagram || 'Not connected'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {/* Portfolio tab can be filled in as needed */}
    </Tabs>
  </div>
 );
};

export default ClientProfile;
