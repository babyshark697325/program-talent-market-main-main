import React from 'react';
import { useTheme } from 'next-themes';
import { useRole } from '@/contexts/RoleContext';

// Keep mapping consistent with StudentSettings
const sizeToPx = (s?: string) => {
  if (s === 'small') return '13px';
  if (s === 'large') return '18px';
  if (s === 'medium') return '15px';
  return '15px';
};

function applyFrom(storageKey: string, setTheme: (t: 'light' | 'dark' | 'system') => void): boolean {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed?.fontSize) {
      const currentFontSize = document.documentElement.style.getPropertyValue('--font-size');
      const newFontSize = sizeToPx(parsed.fontSize);
      if (currentFontSize !== newFontSize) {
        document.documentElement.style.setProperty('--font-size', newFontSize);
        document.documentElement.style.setProperty('--font-size-label', parsed.fontSize || 'medium');
      }
    }
    if (parsed?.colorMode) {
      setTheme(parsed.colorMode as 'light' | 'dark' | 'system');
    }
    return true;
  } catch {
    return false;
  }
}

// Bootstraps persisted font-size and color mode across ALL routes, including admin pages.
const GlobalPreferencesBoot: React.FC = () => {
  const { setTheme } = useTheme();
  const { role } = useRole();

  React.useEffect(() => {
    // Apply preferences immediately
    const applyPreferences = () => {
      const path = window.location.pathname || '';
      const isStudentArea = /(^\/student\b)|(^\/student-)|(^\/resources$)|(^\/all-resources$)|(^\/browse-students$)/.test(path);
      const isClientArea = /(^\/client\b)|(^\/client-)|(^\/manage-jobs$)|(^\/post-job$)|(^\/browse-jobs$)/.test(path);

      // Priority by URL first (most reliable), then role, then fallback order
      if (isStudentArea) {
        if (!applyFrom('student-settings', setTheme)) applyFrom('client-settings', setTheme);
        return;
      }
      if (isClientArea) {
        if (!applyFrom('client-settings', setTheme)) applyFrom('student-settings', setTheme);
        return;
      }
      // Role-based preference if no clear URL context
      if (role === 'student') {
        if (!applyFrom('student-settings', setTheme)) applyFrom('client-settings', setTheme);
      } else if (role === 'client') {
        if (!applyFrom('client-settings', setTheme)) applyFrom('student-settings', setTheme);
      } else {
        // admin/unknown
        if (!applyFrom('student-settings', setTheme)) applyFrom('client-settings', setTheme);
      }
    };

    // Apply immediately
    applyPreferences();

    // Also apply on window load as fallback
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', applyPreferences);
      return () => window.removeEventListener('DOMContentLoaded', applyPreferences);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default GlobalPreferencesBoot;
