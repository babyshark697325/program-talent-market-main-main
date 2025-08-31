import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loadUserSettings, saveUserSettings } from '@/lib/userSettings';

const CLIENT_SETTINGS_KEY = "client-settings";

const ClientSettings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Default form values
  const defaultForm = {
    companyName: "Acme, Inc.",
    website: "https://acme.example",
    contactName: "Jane Client",
    contactEmail: "jane@acme.example",
    contactPhone: "+1 (555) 222-3344",
    about: "We hire talented students for web, design, and content projects.",
    hiringCategories: "Web, Design, Marketing",
    budgetRange: "$500 - $5,000",
    workStyle: "Either",
    timezoneWindow: "",
    experienceLevel: "Intermediate",
    notifications: {
      newApplicants: true,
      jobUpdates: true,
      recommendations: false,
      billingEmails: true,
    },
  };

  const [form, setForm] = useState(defaultForm);
  const [settings, setSettings] = useState({
    notifications: defaultForm.notifications,
    privacy: {},
    preferences: {}
  });

  // Load saved settings on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(CLIENT_SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setForm({ ...defaultForm, ...parsed });
      }
    } catch (error) {
      console.error('Error loading client settings:', error);
    }
  }, []);

  // Load settings from database on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await loadUserSettings('client_settings');
      if (savedSettings) {
        setSettings({
          notifications: savedSettings.notifications || settings.notifications,
          privacy: savedSettings.privacy || settings.privacy,
          preferences: savedSettings.preferences || settings.preferences,
        });
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    const success = await saveUserSettings('client_settings', settings);
    
    if (success) {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your settings, preferences, and notifications</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        
        {/* Hiring Preferences */}
        <Card className="bg-secondary/40 border border-primary/10">
          <CardHeader>
            <CardTitle>Hiring Preferences</CardTitle>
            <CardDescription>Defaults for job posts and matching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Categories</Label>
              <Input
                placeholder="e.g. Web, Design, Content"
                value={form.hiringCategories}
                onChange={(e) => setForm({ ...form, hiringCategories: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Work style</Label>
                            <Input
                placeholder="Remote, On-site, or Either."
                value={form.workStyle}
                onChange={(e) => setForm({ ...form, workStyle: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Timezone window</Label>
              <Input
                placeholder="Hours you prefer to collaborate."
                value={form.timezoneWindow}
                onChange={(e) => setForm({ ...form, timezoneWindow: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Experience level</Label>
                            <Input
                placeholder="Beginner, Intermediate, or Advanced."
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Typical Budget Range</Label>
              <Input
                placeholder="$"
                value={form.budgetRange}
                onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-secondary/40 border border-primary/10">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose when we notify you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New applicants</p>
                <p className="text-sm text-muted-foreground">Get an email when someone applies</p>
              </div>
              <Switch
                checked={form.notifications.newApplicants}
                onCheckedChange={(v) => setForm({ ...form, notifications: { ...form.notifications, newApplicants: v } })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Job updates</p>
                <p className="text-sm text-muted-foreground">Edits or status changes to your posts</p>
              </div>
              <Switch
                checked={form.notifications.jobUpdates}
                onCheckedChange={(v) => setForm({ ...form, notifications: { ...form.notifications, jobUpdates: v } })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recommendations</p>
                <p className="text-sm text-muted-foreground">Talent you may want to interview</p>
              </div>
              <Switch
                checked={form.notifications.recommendations}
                onCheckedChange={(v) => setForm({ ...form, notifications: { ...form.notifications, recommendations: v } })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Billing emails</p>
                <p className="text-sm text-muted-foreground">Invoices and receipts</p>
              </div>
              <Switch
                checked={form.notifications.billingEmails}
                onCheckedChange={(v) => setForm({ ...form, notifications: { ...form.notifications, billingEmails: v } })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Placeholder */}
        <Card className="bg-secondary/40 border border-primary/10 lg:col-span-2">
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Payment method and invoicing (coming soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Billing integrations will be available soon. In the meantime, contact support for invoice questions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSettings;
