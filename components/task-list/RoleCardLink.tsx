'use client';

import Link from 'next/link';
import { Role, Candidate, Client, PipelineStage } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowRight, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { PIPELINE_STAGE_LABELS } from '@/lib/constants/pipeline-stages';
import { getBusinessDaysSince } from '@/lib/utils/date-utils';

interface RoleCardLinkProps {
  role: Role;
  client: Client;
  candidates: Candidate[];
}

export function RoleCardLink({ role, client, candidates }: RoleCardLinkProps) {
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(
    c => !['unqualified', 'rejection_0', 'rejection_1', 'rejection_2', 'signed_offer'].includes(c.currentStage)
  );

  // Group candidates by stage
  const candidatesByStage = candidates.reduce((acc, candidate) => {
    const stage = candidate.currentStage;
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<PipelineStage, number>);

  // Key stages to display (prioritize active/important stages)
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

  // Get stages with candidates, limited to most important ones
  const stagesToShow = keyStages
    .filter(stage => candidatesByStage[stage] > 0)
    .slice(0, 6); // Limit to 6 stages to avoid clutter

  // Calculate alerts
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // New candidates submitted in last 24 hours
  const newCandidates = candidates.filter(c => {
    const submittedDate = new Date(c.submittedDate);
    return submittedDate >= oneDayAgo;
  }).length;

  // Candidates in no_status for 2+, 3+, 5+ days
  const noStatusCandidates = candidates.filter(c => c.currentStage === 'no_status');
  const noStatus2Days = noStatusCandidates.filter(c => getBusinessDaysSince(c.stageEnteredDate) >= 2).length;
  const noStatus3Days = noStatusCandidates.filter(c => getBusinessDaysSince(c.stageEnteredDate) >= 3).length;
  const noStatus5Days = noStatusCandidates.filter(c => getBusinessDaysSince(c.stageEnteredDate) >= 5).length;

  // Count distinct alert types (new candidates + highest no_status threshold)
  let alertCount = 0;
  if (newCandidates > 0) alertCount++;
  if (noStatus5Days > 0) alertCount++;
  else if (noStatus3Days > 0) alertCount++;
  else if (noStatus2Days > 0) alertCount++;

  return (
    <Link href={`/dashboard/role/${role.id}`}>
      <Card className="hover:shadow-lg transition-all cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg truncate">
                  {role.title}
                </CardTitle>
                {alertCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5 text-xs">
                    {alertCount}
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1 truncate">
                {client.company}
              </CardDescription>
            </div>
            <PriorityBadge priority={role.priority} />
          </div>

          {/* Time Metrics - Prominent but subtle */}
          {(role.timeToFirstSubmission || role.timeToFirstQualifiedSubmission || role.timeToFirstFiveQualifiedSubmissions) && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-2">
                {role.timeToFirstSubmission !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Time to 1st submit</div>
                    <div className="font-semibold text-sm">
                      {role.timeToFirstSubmission}d
                    </div>
                  </div>
                )}
                {role.timeToFirstQualifiedSubmission !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Time to 1st qualified</div>
                    <div className="font-semibold text-sm">
                      {role.timeToFirstQualifiedSubmission}d
                    </div>
                  </div>
                )}
                {role.timeToFirstFiveQualifiedSubmissions !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Time to 5 qualified</div>
                    <div className="font-semibold text-sm">
                      {role.timeToFirstFiveQualifiedSubmissions}d
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage Counts - Mini cards */}
          {stagesToShow.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs text-muted-foreground mb-2">Pipeline stages</div>
              <div className="flex flex-wrap gap-1.5">
                {stagesToShow.map((stage) => (
                  <div
                    key={stage}
                    className="px-2 py-1 rounded-md bg-muted/50 border border-border text-xs"
                  >
                    <span className="font-medium">{candidatesByStage[stage]}</span>
                    <span className="text-muted-foreground ml-1">
                      {PIPELINE_STAGE_LABELS[stage]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{totalCandidates} candidate{totalCandidates !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
              View Pipeline
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
