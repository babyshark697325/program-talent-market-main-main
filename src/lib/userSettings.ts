import { supabase } from "@/integrations/supabase/client";

export type SettingType = "client_settings" | "admin_settings" | "student_profile" | "student_settings";

export interface UserSettingsData {
  [key: string]: any;
}

interface UserSettingsRow {
  id: string;
  user_id: string;
  setting_type: string;
  settings_data: UserSettingsData;
  created_at: string;
  updated_at: string;
}

/**
 * Load user settings from the database
 */
export async function loadUserSettings(settingType: SettingType): Promise<UserSettingsData | null> {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      console.error("User not authenticated:", authError);
      return null;
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("settings_data")
      .eq("user_id", userData.user.id)
      .eq("setting_type", settingType)
      .maybeSingle() as { data: Pick<UserSettingsRow, "settings_data"> | null; error: any };

    if (error) {
      console.error("Error loading user settings:", error);
      return null;
    }

    return data?.settings_data || null;
  } catch (error) {
    console.error("Unexpected error loading user settings:", error);
    return null;
  }
}

/**
 * Save user settings to the database
 */
export async function saveUserSettings(settingType: SettingType, settingsData: UserSettingsData): Promise<boolean> {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      console.error("User not authenticated:", authError);
      return false;
    }

    const { error } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: userData.user.id,
          setting_type: settingType,
          settings_data: settingsData,
        },
        {
          onConflict: "user_id,setting_type",
        }
      );

    if (error) {
      console.error("Error saving user settings:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error saving user settings:", error);
    return false;
  }
}