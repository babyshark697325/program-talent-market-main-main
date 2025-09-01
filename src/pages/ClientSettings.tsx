import React, { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from 'lucide-react';
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


  // Load settings from localStorage and backend on mount
  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        // Load from localStorage
        const savedLocal = localStorage.getItem(CLIENT_SETTINGS_KEY);
        if (savedLocal) {
          const parsed = JSON.parse(savedLocal);
          setForm({ ...defaultForm, ...parsed });
        }
      } catch (error) {
        console.error('Error loading client settings from localStorage:', error);
      }
      // Load from backend
      const savedSettings = await loadUserSettings('client_settings');
      if (savedSettings) {
        setForm((prev) => ({ ...prev, ...savedSettings }));
      }
    };
    loadAllSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem(CLIENT_SETTINGS_KEY, JSON.stringify(form));
    // Save to backend
    const success = await saveUserSettings('client_settings', form);
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
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold mt-4">Settings</h1>
      </div>
      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Applicants</p>
              <p className="text-sm text-muted-foreground">Get an email when someone applies</p>
            </div>
            <Switch
              checked={form.notifications.newApplicants}
              onCheckedChange={(v) => setForm({ ...form, notifications: { ...form.notifications, newApplicants: v } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Job Updates</p>
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
              <p className="font-medium">Billing Emails</p>
              <p className="text-sm text-muted-foreground">Invoices and receipts</p>
            </div>
            <Switch
              checked={form.notifications.billingEmails}
              onCheckedChange={(v) => setForm({ ...form, notifications: { ...form.notifications, billingEmails: v } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={twoFASwitchOn || show2FASetup}
              onCheckedChange={checked => {
                if (checked) handleEnable2FA();
                else handleDisable2FA();
              }}
            />
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

      {/* Accessibility & Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility & Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Font Size</label>
              <select className="w-full h-10 rounded border px-2">
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Color Mode</label>
              <select className="w-full h-10 rounded border px-2">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Notifications</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" /> Email
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" /> SMS
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default ClientSettings;
