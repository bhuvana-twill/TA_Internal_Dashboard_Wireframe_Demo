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
    (candidate.currentStage === 'submitted' && daysInStage > 2) ||
    (['intro_request_made', 'in_client_process'].includes(candidate.currentStage) && daysInStage > 5);

  const sourceLabel = {
    member_referral: 'Member Referral',
    member_partner: 'Member Partner',
    ta_sourced: 'TA Sourced',
  }[candidate.source];

  return (
    <div className="rounded-lg border bg-card p-3 text-card-foreground hover:shadow-md transition-shadow">
      {/* Header: Name + Time in Stage */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{candidate.name}</div>
        </div>

        {/* Time in Stage - Prominent */}
        <div className={`flex flex-col items-end shrink-0 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-lg font-bold leading-none">{daysInStage}</span>
            <span className="text-xs font-medium">d</span>
          </div>
          {isOverdue && <span className="text-xs font-medium mt-0.5">Overdue ⚠️</span>}
        </div>
      </div>

      {/* Email - Condensed */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 truncate">
        <Mail className="h-3 w-3 shrink-0" />
        <span className="truncate">{candidate.email}</span>
      </div>

      {/* Source Badge - Smaller */}
      <div className="mb-3">
        <Badge variant="outline" className="text-xs">
          {sourceLabel}
        </Badge>
      </div>

      {/* Status Selector - Compact */}
      <div>
        <Select
          value={candidate.currentStage}
          onChange={(e) => onStatusChange(candidate.id, e.target.value as PipelineStage)}
          className="w-full text-xs"
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
