import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { QRCodeCanvas } from 'qrcode.react';
import { generate2FASecret, verify2FACode } from '@/lib/twoFactor';
import { sendPreferenceTest } from '@/lib/notifications';
import { loadUserSettings, saveUserSettings } from '@/lib/userSettings';
import '@/components/ui/settings-dropdown.css';
import '@/components/ui/accessibility-spacing.css';

const defaultForm = {
  fontSize: 'medium',
  colorMode: 'system',
  notifications: {
    newApplicants: { email: true, sms: false },
    jobUpdates: { email: true, sms: false },
    applicationStatus: { email: true, sms: false },
    recommendations: { email: true, sms: false },
    billingEmails: { email: true, sms: false },
  } as Record<string, { email: boolean; sms: boolean }>,
};

const sizeToPx = (s: string | undefined) => {
  if (s === 'small') return '13px';
  if (s === 'large') return '18px';
  return '15px'; // medium/default
};

const StudentSettings: React.FC = () => {
  const { toast } = useToast();

  // Storage keys
  const STUDENT_SETTINGS_KEY = 'student-settings';
  const STUDENT_2FA_KEY = 'myvillage-student-2fa';

  // Form/settings state (aligns with ClientSettings)
  const [form, setForm] = useState(defaultForm);
  const { setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const notifCardRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const [showNotifications, setShowNotifications] = useState(false); // Added this state based on the new useEffect

  // Apply accessibility preferences immediately and sync theme via next-themes
  useEffect(() => {
    const px = sizeToPx(form.fontSize);
    document.documentElement.style.setProperty('--font-size-base', px);
    if (form.colorMode === "system") {
      setTheme("system");
    } else {
      setTheme(form.colorMode);
    }
  }, [form.fontSize, form.colorMode, setTheme]);

  // Handle click outside for notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifCardRef.current && !notifCardRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update a notification setting
  const toggleNotification = (category: string, method: 'email' | 'sms') => {
    setForm(prev => {
      const currentCategory = prev.notifications[category] || { email: false, sms: false };
      return {
        ...prev,
        notifications: {
          ...prev.notifications,
          [category]: {
            ...currentCategory,
            [method]: !currentCategory[method]
          }
        }
      };
    });
  };

  // Load settings (localStorage + backend)
  useEffect(() => {
    const loadAll = async () => {
      try {
        const local = localStorage.getItem(STUDENT_SETTINGS_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          setForm({
            ...defaultForm,
            ...parsed,
            notifications: { ...defaultForm.notifications, ...(parsed.notifications || {}) },
          });
          if (parsed.fontSize) {
            const currentFontSize = document.documentElement.style.getPropertyValue('--font-size');
            const newFontSize = sizeToPx(parsed.fontSize);
            if (currentFontSize !== newFontSize) {
              document.documentElement.style.setProperty('--font-size', newFontSize);
            }
          }
          if (parsed.colorMode) setTheme(parsed.colorMode);
        }
      } catch (e) {
        console.error('Error parsing local student settings', e);
      }
      const remote = await loadUserSettings('student_settings');
      if (remote) {
        // Cast to known type to handle spread and properties
        const loaded = remote as unknown as Partial<typeof defaultForm>;
        setForm(prev => ({
          ...prev,
          ...loaded,
          notifications: { ...defaultForm.notifications, ...(loaded.notifications || {}) },
        }));
        if (loaded.fontSize) {
          const currentFontSize = document.documentElement.style.getPropertyValue('--font-size');
          const newFontSize = sizeToPx(loaded.fontSize as string);
          if (currentFontSize !== newFontSize) {
            document.documentElement.style.setProperty('--font-size', newFontSize);
          }
        }
        if (loaded.colorMode) setTheme(loaded.colorMode as string);
      }
    };
    loadAll();
  }, [setTheme]);

  // Match Notifications card height to total right-column height (desktop only)
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
    mql.addEventListener?.('change', syncHeights as unknown as EventListener);
    syncHeights();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeights);
      mql.removeEventListener?.('change', syncHeights as unknown as EventListener);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (notifCardRef.current) notifCardRef.current.style.minHeight = '';
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem(STUDENT_SETTINGS_KEY, JSON.stringify(form));
    const ok = await saveUserSettings('student_settings', form);
    if (form.colorMode) setTheme(form.colorMode);
    // Fire a test notification to confirm channels for the user
    try {
      await sendPreferenceTest(form.notifications);
    } catch (e) {
      console.warn('Notification test failed', e);
    }
    toast({
      title: ok ? 'Settings saved' : 'Error',
      description: ok ? 'Your settings have been saved successfully.' : 'Failed to save settings. Please try again.',
      variant: ok ? undefined : 'destructive',
    });
    setIsSaving(false);
  };

  // Two-factor auth state
  const [twoFAEnabled, setTwoFAEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STUDENT_2FA_KEY) || '{}').enabled || false;
    } catch {
      return false;
    }
  });
  const [twoFASwitchOn, setTwoFASwitchOn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STUDENT_2FA_KEY) || '{}').enabled || false;
    } catch {
      return false;
    }
  });
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [otpAuthUrl, setOtpAuthUrl] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handleEnable2FA = () => {
    setTwoFASwitchOn(true);
    const { secret, otpauth } = generate2FASecret('student@myvillage.com');
    setTwoFASecret(secret);
    setOtpAuthUrl(otpauth);
    setShow2FASetup(true);
    setCodeInput('');
  };

  const handleVerify2FA = () => {
    setVerifying(true);
    if (twoFASecret && verify2FACode(twoFASecret, codeInput)) {
      setTwoFAEnabled(true);
      setTwoFASwitchOn(true);
      setShow2FASetup(false);
      localStorage.setItem(STUDENT_2FA_KEY, JSON.stringify({ enabled: true, secret: twoFASecret }));
      toast({ title: 'Two-Factor Authentication Enabled', description: '2FA is now active for your student account.' });
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
    setCodeInput('');
    localStorage.setItem(STUDENT_2FA_KEY, JSON.stringify({ enabled: false }));
    toast({ title: 'Two-Factor Authentication Disabled', description: '2FA has been turned off for your student account.' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold mt-4">Settings</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Notifications */}
          <Card ref={notifCardRef}>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how you want to receive notifications for each type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'applicationStatus', label: 'Application Updates', desc: 'Get notified when clients act on your application' },
                { key: 'newApplicants', label: 'New Applicants', desc: 'Get notified when someone applies' },
                { key: 'jobUpdates', label: 'Job Updates', desc: 'Edits or status changes to your posts' },
                { key: 'recommendations', label: 'Requests', desc: 'Get notified when a student responds to your request' },
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
                        onCheckedChange={v => setForm({
                          ...form,
                          notifications: {
                            ...form.notifications,
                            [n.key]: { ...form.notifications[n.key], email: v }
                          }
                        })}
                      />
                      <span className="text-xs">SMS</span>
                      <Switch
                        checked={form.notifications[n.key]?.sms ?? false}
                        onCheckedChange={v => setForm({
                          ...form,
                          notifications: {
                            ...form.notifications,
                            [n.key]: { ...form.notifications[n.key], sms: v }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8" ref={rightColRef}>
          {/* Security */}
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

          {/* Accessibility & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Accessibility & Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium">Text Size</label>
                  <select className="w-full h-10 rounded px-2 settings-dropdown" value={form.fontSize || 'medium'} onChange={e => setForm({ ...form, fontSize: e.target.value })}>
                    <option value="small">Small (Compact)</option>
                    <option value="medium">Medium (Default)</option>
                    <option value="large">Large (Easier Readability)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Color Mode</label>
                  <select className="w-full h-10 rounded px-2 settings-dropdown" value={form.colorMode || 'system'} onChange={e => { const v = e.target.value; setForm({ ...form, colorMode: v }); setTheme(v as 'light' | 'dark' | 'system'); }}>
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
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default StudentSettings;
