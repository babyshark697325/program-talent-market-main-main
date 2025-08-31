import React, { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loadUserSettings, saveUserSettings } from '@/lib/userSettings';
import { generate2FASecret, verify2FACode } from '@/lib/twoFactor';
import { QRCodeCanvas } from 'qrcode.react';


const ClientSettings: React.FC = () => {
  const { toast } = useToast();
  // 2FA State
  const CLIENT_2FA_KEY = 'myvillage-client-2fa';
  // Controls whether 2FA is fully enabled (after verification)
  const [twoFAEnabled, setTwoFAEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLIENT_2FA_KEY) || '{}').enabled || false;
    } catch {
      return false;
    }
  });
  // Controls the visual state of the switch (on during setup or enabled)
  const [twoFASwitchOn, setTwoFASwitchOn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLIENT_2FA_KEY) || '{}').enabled || false;
    } catch {
      return false;
    }
  });
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [otpAuthUrl, setOtpAuthUrl] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  // Form/settings state
  const CLIENT_SETTINGS_KEY = "client-settings";
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
  const [saving, setSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // 2FA Setup Handlers
  const handleEnable2FA = () => {
    setTwoFASwitchOn(true);
    const { secret, otpauth } = generate2FASecret('client@myvillage.com');
    setTwoFASecret(secret);
    setOtpAuthUrl(otpauth);
    setShow2FASetup(true);
    setVerified(false);
    setCodeInput('');
  };

  const handleVerify2FA = () => {
    setVerifying(true);
    if (twoFASecret && verify2FACode(twoFASecret, codeInput)) {
      setTwoFAEnabled(true);
      setTwoFASwitchOn(true);
      setVerified(true);
      setShow2FASetup(false);
      localStorage.setItem(CLIENT_2FA_KEY, JSON.stringify({ enabled: true, secret: twoFASecret }));
      toast({ title: 'Two-Factor Authentication Enabled', description: '2FA is now active for your client account.' });
    } else {
      toast({ title: 'Invalid Code', description: 'The code you entered is incorrect.', variant: 'destructive' });
    }
    setVerifying(false);
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    setTwoFASwitchOn(false);
    setTwoFASecret(null);
    setOtpAuthUrl(null);
    setShow2FASetup(false);
    setVerified(false);
    setCodeInput('');
    localStorage.setItem(CLIENT_2FA_KEY, JSON.stringify({ enabled: false }));
    toast({ title: 'Two-Factor Authentication Disabled', description: '2FA has been turned off for your client account.' });
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

        {/* Two-Factor Authentication Section (moved to bottom) */}
        <Card className="bg-secondary/40 border border-primary/10 lg:col-span-2">
          <CardHeader>
            <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            <CardDescription>Enhance your account security with 2FA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Protect your client account with an extra layer of security.</p>
              </div>
              <Switch checked={twoFASwitchOn || show2FASetup} onCheckedChange={checked => {
                if (checked) handleEnable2FA();
                else handleDisable2FA();
              }} />
            </div>
            {show2FASetup && otpAuthUrl && (
              <div className="mt-4 space-y-4">
                <p className="font-medium">Scan this QR code with your authenticator app:</p>
                <div className="flex justify-center"><QRCodeCanvas value={otpAuthUrl} size={160} /></div>
                <p className="text-sm text-muted-foreground">Or enter this secret manually: <span className="font-mono">{twoFASecret}</span></p>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter 6-digit code"
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value)}
                    maxLength={6}
                    className="w-40"
                  />
                  <Button onClick={handleVerify2FA} disabled={verifying || codeInput.length !== 6}>
                    {verifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">After verifying, 2FA will be enabled for your account.</p>
              </div>
            )}
            {twoFAEnabled && !show2FASetup && (
              <div className="mt-2 text-green-600 font-medium">2FA is enabled for your account.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSettings;
