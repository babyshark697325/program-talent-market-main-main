
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadUserSettings, saveUserSettings } from '@/lib/userSettings';

const STUDENT_SETTINGS_KEY = 'myvillage-student-settings';

const StudentSettings: React.FC = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({ jobAlerts: true, messages: true });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  // Avatar state (local only, not persisted)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerAvatarPick = () => fileInputRef.current?.click();
  const handleAvatarChange = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };
  const removeAvatar = () => setAvatarUrl(null);

  // Load settings on mount
  React.useEffect(() => {
    const load = async () => {
      const savedSettingsLocal = localStorage.getItem(STUDENT_SETTINGS_KEY);
      if (savedSettingsLocal) {
        const parsed = JSON.parse(savedSettingsLocal);
        setEmailSettings(parsed.emailSettings || emailSettings);
        setTwoFAEnabled(parsed.twoFAEnabled || false);
      }
      const savedSettings = await loadUserSettings('student_settings');
      if (savedSettings) {
        setEmailSettings(savedSettings.emailSettings || emailSettings);
        setTwoFAEnabled(savedSettings.twoFAEnabled || false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    const settingsData = { emailSettings, twoFAEnabled };
    localStorage.setItem(STUDENT_SETTINGS_KEY, JSON.stringify(settingsData));
    const success = await saveUserSettings('student_settings', settingsData);
    if (success) {
      toast({ title: "Settings saved", description: "Your settings have been saved successfully." });
    } else {
      toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleAvatarChange(e.target.files?.[0] || null)}
          />
          {avatarUrl ? (
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt="Profile" />
            </Avatar>
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.125a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21c-2.676 0-5.216-.584-7.499-1.875z" />
              </svg>
            </div>
          )}
          <button
            type="button"
            onClick={triggerAvatarPick}
            aria-label="Change photo"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border bg-background shadow hover:bg-secondary flex items-center justify-center"
          >
            <Image className="h-4 w-4" />
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={removeAvatar}
              className="mt-2 block text-xs text-muted-foreground hover:text-red-600"
            >
              Remove photo
            </button>
          )}
        </div>
        <h1 className="text-3xl font-bold mt-4">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Job Alerts</p>
              <p className="text-sm text-muted-foreground">Receive notifications about new job opportunities</p>
            </div>
            <Switch
              checked={emailSettings.jobAlerts}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, jobAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-muted-foreground">Receive notifications about new messages</p>
            </div>
            <Switch
              checked={emailSettings.messages}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, messages: checked })}
            />
          </div>
        </CardContent>
      </Card>

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
              checked={twoFAEnabled}
              onCheckedChange={setTwoFAEnabled}
            />
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPassword(!showPassword)}>
              Change Password
            </Button>
            {showPassword && (
              <div className="mt-4 space-y-3">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={async () => {
                    if (!pwd.current || !pwd.next || !pwd.confirm) {
                      toast({ title: "All fields required", variant: "destructive" });
                      return;
                    }
                    if (pwd.next !== pwd.confirm) {
                      toast({ title: "Passwords do not match", variant: "destructive" });
                      return;
                    }
                    if (pwd.next.length < 8) {
                      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
                      return;
                    }
                    const { error } = await supabase.auth.updateUser({ password: pwd.next });
                    if (error) {
                      toast({ title: "Password update failed", description: error.message, variant: "destructive" });
                    } else {
                      toast({ title: "Password updated", description: "Your password has been changed." });
                      setPwd({ current: "", next: "", confirm: "" });
                      setShowPassword(false);
                    }
                  }}>Update Password</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowPassword(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default StudentSettings;
