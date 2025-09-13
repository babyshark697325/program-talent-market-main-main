import { supabase } from "@/integrations/supabase/client";
import { loadUserSettings, type SettingType } from "@/lib/userSettings";

export type NotificationType =
  | 'newApplicants'
  | 'jobUpdates'
  | 'requests' // alias for recommendations key in settings
  | 'billingEmails'
  | 'applicationStatus';

export type Channel = 'email' | 'sms';

export interface ChannelPrefs { email?: boolean; sms?: boolean }

export async function getCurrentUserContact() {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id;
  const email = auth?.user?.email || undefined;
  let phone: string | undefined = undefined;
  try {
    // Prefer phone from saved client settings if available
    const client = await loadUserSettings('client_settings');
    if (client?.contactPhone && typeof client.contactPhone === 'string') {
      phone = client.contactPhone as string;
    }
    // Fallback to student profile phone if present
    if (!phone) {
      const studentProfile = await loadUserSettings('student_profile');
      if (studentProfile?.phone && typeof studentProfile.phone === 'string') {
        phone = studentProfile.phone as string;
      }
    }
    // Optional: if profiles has a phone column in future, uncomment below
    // if (!phone && userId) {
    //   const { data: profile } = await supabase
    //     .from('profiles')
    //     .select('phone')
    //     .eq('user_id', userId)
    //     .maybeSingle();
    //   phone = (profile as any)?.phone;
    // }
  } catch {}
  return { userId, email, phone };
}

// Record notifications in DB; backend/cron can deliver via providers.
async function recordNotification(row: {
  user_id: string;
  channel: Channel;
  type: NotificationType;
  subject: string;
  message: string;
  meta?: any;
}) {
  const { data, error } = await supabase.from('notifications').insert({
    user_id: row.user_id,
    channel: row.channel,
    type: row.type,
    subject: row.subject,
    message: row.message,
    meta: row.meta || null,
    status: 'queued',
  }).select().single();
  if (error) throw error;
  return data;
}

export async function dispatchNotification(
  type: NotificationType,
  channels: Channel[],
  opts?: { subject?: string; message?: string }
) {
  const { userId, email, phone } = await getCurrentUserContact();
  if (!userId) return [];
  const subject = opts?.subject || `Notification: ${type}`;
  const message = opts?.message || `You have a new ${type} notification.`;

  const results: { channel: Channel; ok: boolean; reason?: string }[] = [];
  for (const ch of channels) {
    if (ch === 'email') {
      if (!email) { results.push({ channel: ch, ok: false, reason: 'no-email' }); continue; }
      // Record as queued first
      let inserted: any = null;
      try {
        inserted = await recordNotification({ user_id: userId, channel: ch, type, subject, message, meta: { to: email } });
      } catch (err) {
        results.push({ channel: ch, ok: false, reason: 'db-insert-failed' });
        continue;
      }

      try {
        const resp = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: email, subject, html: `<p>${message}</p>` })
        });
        if (resp.ok) {
          try { if (inserted?.id) await supabase.from('notifications').update({ status: 'sent' }).eq('id', inserted.id); } catch {}
          results.push({ channel: ch, ok: true });
        } else {
          const errBody = await resp.json().catch(() => ({}));
          results.push({ channel: ch, ok: false, reason: 'send-failed', ...(errBody ? { details: errBody } : {}) });
        }
      } catch (sendErr) {
        results.push({ channel: ch, ok: false, reason: 'send-error' });
      }
    } else if (ch === 'sms') {
      if (!phone) { results.push({ channel: ch, ok: false, reason: 'no-phone' }); continue; }
      // Record queued notification
      let inserted: any = null;
      try {
        inserted = await recordNotification({ user_id: userId, channel: ch, type, subject, message, meta: { to: phone } });
      } catch (err) {
        results.push({ channel: ch, ok: false, reason: 'db-insert-failed' });
        continue;
      }

      try {
        const resp = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: phone, subject, message, type })
        });
        if (resp.ok) {
          try { if (inserted?.id) await supabase.from('notifications').update({ status: 'sent' }).eq('id', inserted.id); } catch {}
          results.push({ channel: ch, ok: true });
        } else {
          const errBody = await resp.json().catch(() => ({}));
          results.push({ channel: ch, ok: false, reason: 'send-failed', ...(errBody ? { details: errBody } : {}) });
        }
      } catch (sendErr) {
        results.push({ channel: ch, ok: false, reason: 'send-error' });
      }
    } else {
      results.push({ channel: ch, ok: false, reason: 'channel-unknown' });
    }
  }
  return results;
}

// Convenience: send a single test notification confirming preference changes
export async function sendPreferenceTest(prefs: Record<string, { email?: boolean; sms?: boolean }>) {
  const channels: Channel[] = [];
  const anyEmail = Object.values(prefs).some(p => !!p?.email);
  const anySMS = Object.values(prefs).some(p => !!p?.sms);
  if (anyEmail) channels.push('email');
  if (anySMS) channels.push('sms');
  if (channels.length === 0) return [] as const;
  return dispatchNotification('jobUpdates', channels, {
    subject: 'Preferences updated',
    message: 'You will now receive notifications per your settings.',
  });
}

// Map a NotificationType to the settings key used for preferences
function prefsKeyFor(type: NotificationType): string {
  if (type === 'requests') return 'recommendations';
  return type;
}

// Determine channels to send for a given type using provided prefs
export function channelsForType(
  prefs: Record<string, { email?: boolean; sms?: boolean }> | undefined,
  type: NotificationType
): Channel[] {
  const key = prefsKeyFor(type);
  const p = (prefs || {})[key] || {};
  const ch: Channel[] = [];
  if (p.email) ch.push('email');
  if (p.sms) ch.push('sms');
  return ch;
}

// Notify using provided prefs for the specific type
export async function notifyWithPrefs(
  type: NotificationType,
  prefs: Record<string, { email?: boolean; sms?: boolean }> | undefined,
  opts?: { subject?: string; message?: string }
) {
  const channels = channelsForType(prefs, type);
  if (channels.length === 0) return [] as const;
  return dispatchNotification(type, channels, opts);
}

// Notify using saved settings for the current user; tries the provided settingType first, falls back to the other role
export async function notifyFromSaved(
  type: NotificationType,
  settingType?: Extract<SettingType, 'client_settings' | 'student_settings'>,
  opts?: { subject?: string; message?: string }
) {
  let saved = null as any;
  if (settingType) saved = await loadUserSettings(settingType);
  if (!saved) saved = await loadUserSettings('client_settings');
  if (!saved) saved = await loadUserSettings('student_settings');
  const prefs = saved?.notifications as Record<string, { email?: boolean; sms?: boolean }> | undefined;
  return notifyWithPrefs(type, prefs, opts);
}
