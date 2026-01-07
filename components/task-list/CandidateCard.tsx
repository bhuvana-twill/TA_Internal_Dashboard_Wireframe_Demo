'use client';

import { Candidate, PipelineStage } from '@/types';
import { PIPELINE_STAGE_LABELS, PIPELINE_STAGES } from '@/lib/constants/pipeline-stages';
import { getBusinessDaysSince } from '@/lib/utils/date-utils';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Clock, Mail } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
}

export function CandidateCard({ candidate, onStatusChange }: CandidateCardProps) {
  const daysInStage = getBusinessDaysSince(candidate.stageEnteredDate);
  const isOverdue =
    (candidate.currentStage === 'submitted_referral' && daysInStage > 2) ||
    (candidate.currentStage.includes('screening') && daysInStage > 5);

  const sourceLabel = {
    member_referral: 'Member Referral',
    member_partner: 'Member Partner',
    ta_sourced: 'TA Sourced',
  }[candidate.source];

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-base">{candidate.name}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Mail className="h-3 w-3" />
            {candidate.email}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            {sourceLabel}
          </Badge>
        </div>

        <div className={`flex items-center gap-1 text-xs whitespace-nowrap ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          <Clock className="h-3 w-3" />
          {daysInStage}d
          {isOverdue && ' ⚠️'}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Update Status
        </label>
        <Select
          value={candidate.currentStage}
          onChange={(e) => onStatusChange(candidate.id, e.target.value as PipelineStage)}
          className="w-full"
        >
          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {PIPELINE_STAGE_LABELS[stage]}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
