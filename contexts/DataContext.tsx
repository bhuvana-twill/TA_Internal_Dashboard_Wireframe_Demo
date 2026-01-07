'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Client,
  Role,
  Candidate,
  TalentAdvisor,
  ChecklistItem,
  Alert,
  PipelineStage,
  RolePriority,
} from '@/types';
import { mockClients } from '@/lib/mock-data/clients';
import { mockRoles } from '@/lib/mock-data/roles';
import { mockCandidates } from '@/lib/mock-data/candidates-new';
import { mockTAs } from '@/lib/mock-data/tas';
import { mockChecklists } from '@/lib/mock-data/checklists';
import { mockAlerts } from '@/lib/mock-data/alerts';

interface DataContextType {
  clients: Client[];
  roles: Role[];
  candidates: Candidate[];
  tas: TalentAdvisor[];
  checklists: ChecklistItem[];
  alerts: Alert[];

  // Mutation methods for interactive demo
  updateCandidateStage: (candidateId: string, stage: PipelineStage) => void;
  toggleChecklistItem: (itemId: string) => void;
  dismissAlert: (alertId: string) => void;
  updateRolePriority: (roleId: string, priority: RolePriority) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients] = useState<Client[]>(mockClients);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [tas] = useState<TalentAdvisor[]>(mockTAs);
  const [checklists, setChecklists] = useState<ChecklistItem[]>(mockChecklists);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const updateCandidateStage = (candidateId: string, stage: PipelineStage) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === candidateId
          ? {
              ...candidate,
              currentStage: stage,
              stageEnteredDate: new Date(),
              lastUpdatedDate: new Date(),
            }
          : candidate
      )
    );
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklists(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              completedDate: !item.completed ? new Date() : undefined,
            }
          : item
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const updateRolePriority = (roleId: string, priority: RolePriority) => {
    setRoles(prev =>
      prev.map(role => (role.id === roleId ? { ...role, priority } : role))
    );
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        roles,
        candidates,
        tas,
        checklists,
        alerts,
        updateCandidateStage,
        toggleChecklistItem,
        dismissAlert,
        updateRolePriority,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
