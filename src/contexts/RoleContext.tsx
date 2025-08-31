
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
  const [role, setRoleState] = useState<UserRole>('client');
  const [manual, setManual] = useState(false);

  // Allow manual switching only for admin/developer
  const setRole = (r: UserRole) => {
    if (userRole === 'admin' || userRole === 'developer') {
      setManual(true);
      setRoleState(r);
    }
  };

  // Auto-sync to authenticated user role when not manually overridden (or if not admin/developer)
  useEffect(() => {
    if (!manual || !(userRole === 'admin' || userRole === 'developer')) {
      if (userRole) setRoleState(userRole as UserRole);
      else setRoleState('client');
    }
  }, [userRole, manual]);

  // Reset override on logout or when leaving guest mode
  useEffect(() => {
    if (!user && !isGuest) {
      setManual(false);
      setRoleState('client');
    }
  }, [user, isGuest]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
