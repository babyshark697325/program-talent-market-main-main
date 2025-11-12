
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type UserRole = 'student' | 'client' | 'admin' | 'developer';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user, userRole, isGuest } = useAuth();
  
  // Initialize role from localStorage with fallback
  const [role, setRoleState] = useState<UserRole>(() => {
    const stored = localStorage.getItem('selectedRole') as UserRole;
    return stored && ['student', 'client', 'admin', 'developer'].includes(stored) ? stored : 'client';
  });

  // Simple setRole that ALWAYS works for guests, admins, and developers
  const setRole = (r: UserRole) => {
    // For guests, always allow role switching
    if (isGuest) {
      setRoleState(r);
      localStorage.setItem('selectedRole', r);
      return;
    }
    
    // For admin/developer, always allow role switching  
    if (userRole === 'admin' || userRole === 'developer') {
      setRoleState(r);
      localStorage.setItem('selectedRole', r);
      return;
    }
  };

  // Minimal effect - only restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedRole') as UserRole;
    if (stored && ['student', 'client', 'admin', 'developer'].includes(stored)) {
      setRoleState(stored);
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
