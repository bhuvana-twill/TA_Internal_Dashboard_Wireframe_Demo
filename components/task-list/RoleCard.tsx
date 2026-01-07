'use client';

import { useState } from 'react';
import { Role, Candidate, Client, PipelineStage } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from './PriorityBadge';
import { TimeMetrics } from './TimeMetrics';
import { PipelineStages } from './PipelineStages';
import { CandidateList } from './CandidateList';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

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

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{role.title}</CardTitle>
            <CardDescription className="mt-1">
              {client.company} · {client.status.replace('_', ' ')}
            </CardDescription>
          </div>
          <PriorityBadge priority={role.priority} />
        </div>

        <div className="mt-4 space-y-2">
          {role.timeToFirstSubmission !== undefined && (
            <TimeMetrics
              timeToFirstSubmission={role.timeToFirstSubmission}
              timeToFirstQualifiedSubmission={role.timeToFirstQualifiedSubmission}
              timeToFirstFiveQualifiedSubmissions={role.timeToFirstFiveQualifiedSubmissions}
            />
          )}

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={isLowCandidateCount ? 'text-destructive font-medium' : ''}>
              {activeCandidates.length} active candidates
              {isLowCandidateCount && ' ⚠️ (needs 5+)'}
            </span>
          </div>
        </div>
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
