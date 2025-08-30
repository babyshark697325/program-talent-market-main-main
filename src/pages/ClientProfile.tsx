import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Globe, Phone, Mail, Edit, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CLIENT_PROFILE_KEY = "client-profile";

const ClientProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultForm = {
    companyName: "Acme, Inc.",
    website: "https://acme.example",
    contactName: "Jane Client",
    contactEmail: "jane@acme.example",
    contactPhone: "+1 (555) 222-3344",
    about: "We hire talented students for web, design, and content projects.",
  };

  const [form, setForm] = useState(defaultForm);
  const [edited, setEdited] = useState(form);

  // Load saved profile on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(CLIENT_PROFILE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        const loadedForm = { ...defaultForm, ...parsed };
        setForm(loadedForm);
        setEdited(loadedForm);
      }
    } catch (error) {
      console.error('Error loading client profile:', error);
    }
  }, []);

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem(CLIENT_PROFILE_KEY, JSON.stringify(edited));
      
      setForm(edited);
      setIsEditing(false);
      
      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEdited(form);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Profile */}
        <Card className="bg-secondary/40 border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={18} /> Company Profile
            </CardTitle>
            <CardDescription>Public info clients and students may see</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Company Name</Label>
              {isEditing ? (
                <Input value={edited.companyName} onChange={(e) => setEdited({ ...edited, companyName: e.target.value })} />
              ) : (
                <p className="font-medium">{form.companyName}</p>
              )}
            </div>
            <div>
              <Label className="text-sm flex items-center gap-2"><Globe size={14} /> Website</Label>
              {isEditing ? (
                <Input placeholder="https://" value={edited.website} onChange={(e) => setEdited({ ...edited, website: e.target.value })} />
              ) : (
                <p className="text-muted-foreground">{form.website || "—"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm">About</Label>
              {isEditing ? (
                <Textarea rows={4} value={edited.about} onChange={(e) => setEdited({ ...edited, about: e.target.value })} />
              ) : (
                <p className="text-muted-foreground">{form.about || "—"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card className="bg-secondary/40 border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={18} /> Primary Contact
            </CardTitle>
            <CardDescription>Used for communication and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Full Name</Label>
              {isEditing ? (
                <Input value={edited.contactName} onChange={(e) => setEdited({ ...edited, contactName: e.target.value })} />
              ) : (
                <p className="font-medium">{form.contactName}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm flex items-center gap-2"><Mail size={14} /> Email</Label>
                {isEditing ? (
                  <Input type="email" value={edited.contactEmail} onChange={(e) => setEdited({ ...edited, contactEmail: e.target.value })} />
                ) : (
                  <p className="text-muted-foreground">{form.contactEmail}</p>
                )}
              </div>
              <div>
                <Label className="text-sm flex items-center gap-2"><Phone size={14} /> Phone</Label>
                {isEditing ? (
                  <Input value={edited.contactPhone} onChange={(e) => setEdited({ ...edited, contactPhone: e.target.value })} />
                ) : (
                  <p className="text-muted-foreground">{form.contactPhone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfile;
