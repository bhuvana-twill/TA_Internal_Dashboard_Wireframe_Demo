'use client';

import { Candidate, PipelineStage } from '@/types';
import { CandidateCard } from './CandidateCard';

interface CandidateListProps {
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
}

export function CandidateList({ candidates, onStatusChange }: CandidateListProps) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No candidates in this stage</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
