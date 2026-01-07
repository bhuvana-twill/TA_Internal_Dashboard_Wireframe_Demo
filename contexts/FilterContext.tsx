'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PipelineStage, RolePriority } from '@/types';

interface FilterContextType {
  stageFilter?: PipelineStage;
  setStageFilter: (stage?: PipelineStage) => void;
  sortBy: 'stage' | 'time';
  setSortBy: (sort: 'stage' | 'time') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  taFilter?: string; // TA ID filter
  setTaFilter: (taId?: string) => void;
  accountFilter?: string; // Client/account ID filter
  setAccountFilter: (clientId?: string) => void;
  priorityFilter?: RolePriority; // Priority filter
  setPriorityFilter: (priority?: RolePriority) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [stageFilter, setStageFilter] = useState<PipelineStage | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'stage' | 'time'>('time');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [taFilter, setTaFilter] = useState<string | undefined>(undefined);
  const [accountFilter, setAccountFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<RolePriority | undefined>(undefined);

  return (
    <FilterContext.Provider
      value={{
        stageFilter,
        setStageFilter,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        taFilter,
        setTaFilter,
        accountFilter,
        setAccountFilter,
        priorityFilter,
        setPriorityFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
