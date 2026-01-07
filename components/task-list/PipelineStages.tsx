'use client';

import { PipelineCounts } from '@/types';
import { PIPELINE_STAGE_LABELS } from '@/lib/constants/pipeline-stages';

interface PipelineStagesProps {
  counts: PipelineCounts;
}

export function PipelineStages({ counts }: PipelineStagesProps) {
  const stages = [
    { key: 'submittedReferrals', label: 'Submitted Referrals', count: counts.submittedReferrals },
    { key: 'memberPartners', label: 'Member Partners', count: counts.memberPartners },
    { key: 'members', label: 'Members', count: counts.members },
    { key: 'taSourcing', label: 'TA Sourcing', count: counts.taSourcing },
    { key: 'validatedCandidates', label: 'Validated', count: counts.validatedCandidates },
    { key: 'qualifiedAwaitingScreening', label: 'Awaiting Screening', count: counts.qualifiedAwaitingScreening },
    { key: 'qualifiedScreened', label: 'Screened', count: counts.qualifiedScreened },
    { key: 'submittedToClient', label: 'Submitted to Client', count: counts.submittedToClient },
    { key: 'awaitingClientFeedback', label: 'Awaiting Feedback', count: counts.awaitingClientFeedback },
    { key: 'clientApproved', label: 'Client Approved', count: counts.clientApproved },
    { key: 'clientInterview1', label: 'Interview 1', count: counts.clientInterview1 },
    { key: 'clientInterview2', label: 'Interview 2', count: counts.clientInterview2 },
    { key: 'takeHomeExercise', label: 'Take Home', count: counts.takeHomeExercise },
    { key: 'referenceChecks', label: 'Reference Checks', count: counts.referenceChecks },
    { key: 'hired', label: 'Hired', count: counts.hired },
    { key: 'disqualified', label: 'Disqualified', count: counts.disqualified },
    { key: 'clientDisqualified', label: 'Client Disqualified', count: counts.clientDisqualified },
  ];

  const activeStages = stages.filter(s => s.count > 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {activeStages.map((stage) => (
        <div
          key={stage.key}
          className="rounded-lg border bg-background p-3 text-center hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold">{stage.count}</div>
          <div className="text-xs text-muted-foreground mt-1">{stage.label}</div>
        </div>
      ))}
    </div>
  );
}
