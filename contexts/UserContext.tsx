'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TalentAdvisor, UserRole } from '@/types';
import { mockTAs } from '@/lib/mock-data/tas';

interface UserContextType {
  currentUser: TalentAdvisor;
  userRole: UserRole;
  switchRole: (role: UserRole) => void;
  selectedTAId?: string;
  setSelectedTA: (taId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Default to first TA
  const [currentUser, setCurrentUser] = useState<TalentAdvisor>(mockTAs[0]);
  const [selectedTAId, setSelectedTAIdState] = useState<string | undefined>(undefined);

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      const adminUser = mockTAs.find(ta => ta.role === 'admin');
      if (adminUser) {
        setCurrentUser(adminUser);
      }
    } else {
      // Switch to first TA
      const taUser = mockTAs.find(ta => ta.role === 'ta');
      if (taUser) {
        setCurrentUser(taUser);
        setSelectedTAIdState(undefined);
      }
    }
  };

  const setSelectedTA = (taId: string) => {
    setSelectedTAIdState(taId);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        userRole: currentUser.role,
        switchRole,
        selectedTAId,
        setSelectedTA,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
}
