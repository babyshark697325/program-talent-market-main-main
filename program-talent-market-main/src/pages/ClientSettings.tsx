import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

const ClientSettings: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
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
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate a save action; wire to API later
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
            <Settings className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">Manage your settings, preferences, and notifications</p>
          </div>
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
