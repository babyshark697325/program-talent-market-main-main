import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { generate2FASecret, verify2FACode } from '@/lib/twoFactor';
import { QRCodeCanvas } from 'qrcode.react';

const ADMIN_SETTINGS_KEY = 'myvillage-admin-settings';

const ADMIN_2FA_KEY = 'myvillage-admin-2fa';
const AdminSettings = () => {
  // 2FA State
  const [twoFAEnabled, setTwoFAEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_2FA_KEY) || '{}').enabled || false;
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
  // 2FA Setup Handlers
  const handleEnable2FA = () => {
    const { secret, otpauth } = generate2FASecret('admin@myvillage.com');
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
      setVerified(true);
      setShow2FASetup(false);
      localStorage.setItem(ADMIN_2FA_KEY, JSON.stringify({ enabled: true, secret: twoFASecret }));
      toast({ title: 'Two-Factor Authentication Enabled', description: '2FA is now active for your admin account.' });
    } else {
      toast({ title: 'Invalid Code', description: 'The code you entered is incorrect.', variant: 'destructive' });
    }
    setVerifying(false);
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    setTwoFASecret(null);
    setOtpAuthUrl(null);
    setShow2FASetup(false);
    setVerified(false);
    setCodeInput('');
    localStorage.setItem(ADMIN_2FA_KEY, JSON.stringify({ enabled: false }));
    toast({ title: 'Two-Factor Authentication Disabled', description: '2FA has been turned off for your admin account.' });
  };
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'MyVillage Talent Platform',
    supportEmail: 'support@myvillage.com',
    platformDescription: 'Connect talented students with opportunities from forward-thinking companies',
    autoApproveStudents: true,
    requireEmailVerification: true,
    enableJobPosting: true,
    enableMessaging: true,
    enableNotifications: true,
    maintenanceMode: false
  });

  // Load saved settings on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(ADMIN_SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
      
      // Simulate API save
      await new Promise((r) => setTimeout(r, 600));
      
      toast({
        title: "Settings saved",
        description: "Admin settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving admin settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      platformName: 'MyVillage Talent Platform',
      supportEmail: 'support@myvillage.com',
      platformDescription: 'Connect talented students with opportunities from forward-thinking companies',
      autoApproveStudents: true,
      requireEmailVerification: true,
      enableJobPosting: true,
      enableMessaging: true,
      enableNotifications: true,
      maintenanceMode: false
    };
    setSettings(defaultSettings);
    localStorage.removeItem(ADMIN_SETTINGS_KEY);
    toast({ title: 'Reset to default', description: 'Settings reset to default values.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-2">System Settings</h1>
            <p className="text-muted-foreground text-lg">Configure platform settings and preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input 
                  id="platform-name" 
                  value={settings.platformName}
                  onChange={(e) => setSettings(prev => ({ ...prev, platformName: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input 
                  id="support-email" 
                  type="email" 
                  value={settings.supportEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform-description">Platform Description</Label>
                <Textarea 
                  id="platform-description" 
                  value={settings.platformDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, platformDescription: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Configure user registration and verification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve student registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new student accounts
                  </p>
                </div>
                <Switch 
                  checked={settings.autoApproveStudents}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproveStudents: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require email verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform
                  </p>
                </div>
                <Switch 
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable client vetting</Label>
                  <p className="text-sm text-muted-foreground">
                    Manually review and approve client accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment processing and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                <Input id="platform-fee" type="number" defaultValue="10" min="0" max="50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min-payout">Minimum Payout Amount ($)</Label>
                <Input id="min-payout" type="number" defaultValue="25" min="1" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable instant payouts</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to receive instant payments (additional fees may apply)
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Admin alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for system issues and reports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Send weekly platform performance reports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset to Default
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
