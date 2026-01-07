'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PipelineStage } from '@/types';

interface FilterContextType {
  stageFilter?: PipelineStage;
  setStageFilter: (stage?: PipelineStage) => void;
  sortBy: 'stage' | 'time';
  setSortBy: (sort: 'stage' | 'time') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [stageFilter, setStageFilter] = useState<PipelineStage | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'stage' | 'time'>('time');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <FilterContext.Provider
      value={{
        stageFilter,
        setStageFilter,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
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
