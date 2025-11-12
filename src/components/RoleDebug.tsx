import React, { useEffect, useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';

const RoleDebug: React.FC = () => {
  const { role } = useRole();
  const { userRole, isGuest } = useAuth();
  const [storedRole, setStoredRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Safely access localStorage
    const getStoredRole = () => {
      try {
        return typeof window !== 'undefined' ? localStorage.getItem('selectedRole') : null;
      } catch (error) {
        console.warn('Failed to access localStorage:', error);
        return null;
      }
    };

    const stored = getStoredRole();
    setStoredRole(stored);

    console.log('Role Debug:', {
      currentRole: role,
      userRole,
      isGuest,
      storedRole: stored,
      timestamp: new Date().toISOString()
    });
  }, [role, userRole, isGuest]);

  // Only show in development and when window is available
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50 font-mono">
      <div>Role: {role || 'undefined'}</div>
      <div>UserRole: {userRole || 'none'}</div>
      <div>Guest: {isGuest ? 'yes' : 'no'}</div>
      <div>Stored: {storedRole || 'none'}</div>
    </div>
  );
};

export default RoleDebug;
