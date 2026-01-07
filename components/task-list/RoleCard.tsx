'use client';

import { useState } from 'react';
import { Role, Candidate, Client, PipelineStage } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from './PriorityBadge';
import { PipelineStages } from './PipelineStages';
import { CandidateList } from './CandidateList';
import { ChevronDown, ChevronUp, Users, Clock, DollarSign, Target } from 'lucide-react';
import { PIPELINE_STAGE_LABELS } from '@/lib/constants/pipeline-stages';
import { calculatePlacementProbability } from '@/lib/utils/probability-utils';

interface RoleCardProps {
  role: Role;
  client: Client;
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
}

export function RoleCard({ role, client, candidates, onStatusChange }: RoleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCandidates = candidates.filter(
    c => !['disqualified', 'client_disqualified', 'hired'].includes(c.currentStage)
  );

  const isLowCandidateCount = activeCandidates.length < 5;
  const totalCandidates = candidates.length;
  const placementProbability = calculatePlacementProbability(candidates);

  // Group candidates by stage
  const candidatesByStage = candidates.reduce((acc, candidate) => {
    const stage = candidate.currentStage;
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<PipelineStage, number>);

  // Key stages to display
  const keyStages: PipelineStage[] = [
    'no_status',
    'qualified',
    'twill_interview',
    'submitted',
    'in_client_process',
    'final_stages',
    'verbal_offer',
    'signed_offer',
  ];

  const stagesToShow = keyStages
    .filter(stage => candidatesByStage[stage] > 0)
    .slice(0, 4);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        {/* Header: Company (prominent) + Priority */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate mb-1">
              {client.company}
            </CardTitle>
            <CardDescription className="text-base truncate">
              {role.title}
            </CardDescription>
          </div>
          <PriorityBadge priority={role.priority} />
        </div>

        {/* Key Metrics Row: Revenue + Probability + Total Candidates */}
        <div className="flex items-center gap-4 text-sm">
          {role.estimatedRevenue !== undefined && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">${(role.estimatedRevenue / 1000).toFixed(0)}k</span>
            </div>
          )}
          {placementProbability > 0 && (
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{placementProbability}%</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={isLowCandidateCount ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
              {totalCandidates} candidates
              {isLowCandidateCount && ' ⚠️'}
            </span>
          </div>
        </div>

        {/* Time Metrics - Condensed */}
        {(role.timeToFirstSubmission || role.timeToInClientProcess || role.timeToQualified) && (
          <div className="flex items-center gap-3 text-xs">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            {role.timeToFirstSubmission !== undefined && (
              <div>
                <span className="font-semibold">{role.timeToFirstSubmission}d</span>
                <span className="text-muted-foreground ml-1">1st submit</span>
              </div>
            )}
            {role.timeToQualified !== undefined && (
              <div>
                <span className="font-semibold">{role.timeToQualified}d</span>
                <span className="text-muted-foreground ml-1">1st qualified</span>
              </div>
            )}
            {role.timeToInClientProcess !== undefined && (
              <div>
                <span className="font-semibold">{role.timeToInClientProcess}d</span>
                <span className="text-muted-foreground ml-1">1st in-client process</span>
              </div>
            )}
          </div>
        )}

        {/* Pipeline Stages - Compact */}
        {stagesToShow.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {stagesToShow.map((stage) => (
              <Badge
                key={stage}
                variant="outline"
                className="text-xs font-normal"
              >
                <span className="font-semibold">{candidatesByStage[stage]}</span>
                <span className="ml-1">{PIPELINE_STAGE_LABELS[stage]}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-3">Pipeline Overview</h4>
          <PipelineStages counts={role.pipelineCounts} />
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Candidates ({candidates.length})
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                View All Candidates ({candidates.length})
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div>
            <h4 className="text-sm font-semibold mb-3">All Candidates</h4>
            <CandidateList candidates={candidates} onStatusChange={onStatusChange} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
