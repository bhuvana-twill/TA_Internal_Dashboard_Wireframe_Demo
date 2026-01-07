'use client';

import Link from 'next/link';
import { Role, Candidate, Client, PipelineStage, TalentAdvisor } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowRight, Clock, TrendingUp, AlertCircle, DollarSign, Target, UserCheck } from 'lucide-react';
import { PIPELINE_STAGE_LABELS } from '@/lib/constants/pipeline-stages';
import { getBusinessDaysSince } from '@/lib/utils/date-utils';
import { calculatePlacementProbability } from '@/lib/utils/probability-utils';
import { useCurrentUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';

interface RoleCardLinkProps {
  role: Role;
  client: Client;
  candidates: Candidate[];
  assignedTA?: TalentAdvisor;
}

export function RoleCardLink({ role, client, candidates, assignedTA }: RoleCardLinkProps) {
  const { userRole } = useCurrentUser();
  const { members } = useData();
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(
    c => !['unqualified', 'rejection_0', 'rejection_1', 'rejection_2', 'signed_offer'].includes(c.currentStage)
  );

  // Calculate probability of placement
  const placementProbability = calculatePlacementProbability(candidates);

  // Get unique member partners for this role
  const memberPartners = candidates
    .filter(c => c.memberPartnerId)
    .map(c => members.find(m => m.id === c.memberPartnerId))
    .filter((m, index, self) => m && self.findIndex(x => x?.id === m.id) === index) // Unique partners only
    .filter(Boolean);

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
    .slice(0, 4); // Limit to 4 stages to reduce clutter

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
        <CardHeader className="space-y-4">
          {/* Header: Company (prominent) + Priority + Alerts */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold truncate mb-1">
                {client.company}
              </CardTitle>
              <CardDescription className="text-base truncate">
                {role.title}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {alertCount > 0 && (
                <Badge variant="destructive" className="h-6 min-w-6 flex items-center justify-center px-2">
                  {alertCount}
                </Badge>
              )}
              <PriorityBadge priority={role.priority} />
            </div>
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
              <span className="text-muted-foreground">{totalCandidates} candidates</span>
            </div>
          </div>

          {/* Admin-only: TA + Member Partners */}
          {userRole === 'admin' && (assignedTA || memberPartners.length > 0) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs bg-muted/30 -mx-6 px-6 py-2">
              {assignedTA && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">TA:</span>
                  <span className="font-medium">{assignedTA.name}</span>
                  {memberPartners.length > 0 && (
                    <>
                      <span className="text-muted-foreground mx-1.5">•</span>
                      <span className="text-muted-foreground">Member Partner:</span>
                      <span className="font-medium">
                        {memberPartners.slice(0, 2).map(p => p!.name).join(', ')}
                        {memberPartners.length > 2 && ` +${memberPartners.length - 2}`}
                      </span>
                    </>
                  )}
                </div>
              )}
              {!assignedTA && memberPartners.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Member Partner:</span>
                  <span className="font-medium">
                    {memberPartners.slice(0, 2).map(p => p!.name).join(', ')}
                    {memberPartners.length > 2 && ` +${memberPartners.length - 2}`}
                  </span>
                </div>
              )}
            </div>
          )}

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

          {/* Footer: View Pipeline Link */}
          <div className="flex justify-end pt-2 border-t">
            <div className="flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all font-medium">
              View Pipeline
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
