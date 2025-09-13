import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { loadUserSettings, saveUserSettings } from '@/lib/userSettings';
import { sendPreferenceTest } from '@/lib/notifications';
import { generate2FASecret, verify2FACode } from '@/lib/twoFactor';
import { QRCodeCanvas } from 'qrcode.react';
import '@/components/ui/settings-dropdown.css';
import '@/components/ui/accessibility-spacing.css';


const ClientSettings: React.FC = () => {
  // ...existing code...
  const { toast } = useToast();
  const { setTheme } = useTheme();
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
  // Remove separate switch state; always use form or twoFAEnabled for switch checked value
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
    fontSize: "medium",
    colorMode: "system",
    notifications: {
      newApplicants: { email: true, sms: false },
      jobUpdates: { email: true, sms: false },
      recommendations: { email: true, sms: false },
      billingEmails: { email: true, sms: false },
    } as Record<string, { email: boolean; sms: boolean }>,
  };
  const [form, setForm] = useState(defaultForm);
  // Align mapping with StudentSettings for consistency
  const sizeToPx = (s: string | undefined) => {
    if (s === 'small') return '13px';
    if (s === 'large') return '18px';
    return '15px';
  };
  // Instantly apply font size and sync color mode via next-themes
  useEffect(() => {
  const px = sizeToPx(form.fontSize);
  document.documentElement.style.setProperty('--font-size', px);
  document.documentElement.style.setProperty('--font-size-label', form.fontSize || 'medium');
  setTheme(form.colorMode as 'light' | 'dark' | 'system');
  // If you have switches for notifications or 2FA, always use form or twoFAEnabled for checked value
  }, [form.fontSize, form.colorMode, setTheme]);
  // Removed conflicting effect that set non-pixel font sizes
  const [isSaving, setIsSaving] = useState(false);


  // Load settings from localStorage and backend on mount
  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        // Load from localStorage
        const savedLocal = localStorage.getItem(CLIENT_SETTINGS_KEY);
        if (savedLocal) {
          const parsed = JSON.parse(savedLocal);
          const notifications = { ...defaultForm.notifications, ...(parsed.notifications || {}) };
          Object.keys(notifications).forEach(key => {
            notifications[key].email = true;
          });
          setForm({
            ...defaultForm,
            ...parsed,
            notifications,
          });
          // No need to update separate switch state; always use form for checked value
          if (parsed.fontSize) document.documentElement.style.setProperty('--font-size', sizeToPx(parsed.fontSize));
          if (parsed.colorMode) setTheme(parsed.colorMode as 'light' | 'dark' | 'system');
        }
      } catch (error) {
        console.error('Error loading client settings from localStorage:', error);
      }
      // Load from backend
      const savedSettings = await loadUserSettings('client_settings');
      if (savedSettings) {
        const notifications = { ...defaultForm.notifications, ...(savedSettings.notifications || {}) };
        Object.keys(notifications).forEach(key => {
          notifications[key].email = true;
        });
        setForm(prev => ({
          ...prev,
          ...savedSettings,
          notifications,
        }));
        // No need to update separate switch state; always use form for checked value
        if (savedSettings.fontSize) document.documentElement.style.setProperty('--font-size', sizeToPx(savedSettings.fontSize));
        if (savedSettings.colorMode) setTheme(savedSettings.colorMode as 'light' | 'dark' | 'system');
      }
    };
    loadAllSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem(CLIENT_SETTINGS_KEY, JSON.stringify(form));
    if (form.fontSize) document.documentElement.style.setProperty('--font-size', sizeToPx(form.fontSize));
    if (form.colorMode) setTheme(form.colorMode);
    // Save to backend
    const success = await saveUserSettings('client_settings', form);
    if (success) {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
      // Send a quick test based on current preferences so users know it works
      try { await sendPreferenceTest(form.notifications as any); } catch {}
    } else {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  // Match Notifications card height to total right-column height (desktop only),
  // mirroring StudentSettings UX for visual balance
  const notifCardRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const syncHeights = () => {
      if (!notifCardRef.current) return;
      if (mql.matches && rightColRef.current) {
        const h = rightColRef.current.getBoundingClientRect().height;
        notifCardRef.current.style.minHeight = `${h}px`;
      } else {
        notifCardRef.current.style.minHeight = '';
      }
    };
    const ro = new ResizeObserver(syncHeights);
    if (rightColRef.current) ro.observe(rightColRef.current);
    window.addEventListener('resize', syncHeights);
    mql.addEventListener?.('change', syncHeights as any);
    syncHeights();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeights);
      mql.removeEventListener?.('change', syncHeights as any);
      if (notifCardRef.current) notifCardRef.current.style.minHeight = '';
    };
  }, []);

  // 2FA Setup Handlers
  const handleEnable2FA = () => {
  // ...existing code...
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
  // ...existing code...
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
  // ...existing code...
    setTwoFASecret(null);
    setOtpAuthUrl(null);
    setShow2FASetup(false);
    setVerified(false);
    setCodeInput('');
    localStorage.setItem(CLIENT_2FA_KEY, JSON.stringify({ enabled: false }));
    toast({ title: 'Two-Factor Authentication Disabled', description: '2FA has been turned off for your client account.' });
  };



  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold mt-4">Settings</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
            {/* Notifications Section */}
            <Card ref={notifCardRef}>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how you want to receive notifications for each type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'newApplicants', label: 'New Applicants', desc: 'Get notified when someone applies' },
                  { key: 'jobUpdates', label: 'Job Updates', desc: 'Edits or status changes to your posts' },
                  { key: 'recommendations', label: 'Recommendations', desc: 'Talent you may want to interview' },
                  { key: 'billingEmails', label: 'Billing', desc: 'Invoices and receipts' }
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{n.label}</p>
                      <p className="text-sm text-muted-foreground">{n.desc}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Email</span>
                        <Switch
                          checked={form.notifications[n.key]?.email ?? false}
                          onCheckedChange={v => setForm({ ...form, notifications: { ...form.notifications, [n.key]: { ...form.notifications[n.key], email: v } } })}
                        />
                        <span className="text-xs">SMS</span>
                        <Switch
                          checked={form.notifications[n.key]?.sms ?? false}
                          onCheckedChange={v => setForm({ ...form, notifications: { ...form.notifications, [n.key]: { ...form.notifications[n.key], sms: v } } })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
        </div>
        <div className="space-y-8" ref={rightColRef}>
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
                    checked={twoFAEnabled || show2FASetup}
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
                {/* Only keep the controlled dropdowns below */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-sm font-medium">Text Size</label>
                      <select className="w-full h-10 rounded px-2 settings-dropdown" value={form.fontSize || "medium"} onChange={e => setForm({ ...form, fontSize: e.target.value })}>
                        <option value="small">Small (Compact)</option>
                        <option value="medium">Medium (Default)</option>
                        <option value="large">Large (Easier Readability)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Color Mode</label>
                      <select className="w-full h-10 rounded px-2 settings-dropdown" value={form.colorMode || "system"} onChange={e => { const v = e.target.value; setForm({ ...form, colorMode: v }); setTheme(v as 'light' | 'dark' | 'system'); }}>
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </div>
              </CardContent>
            </Card>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default ClientSettings;
