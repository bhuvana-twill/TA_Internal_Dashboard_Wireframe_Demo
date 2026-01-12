'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Role, Candidate } from '@/types';
import { useData } from '@/contexts/DataContext';

interface RoleAlertsProps {
  role: Role;
  candidates: Candidate[];
  clientName: string;
}

export function RoleAlerts({ role, candidates, clientName }: RoleAlertsProps) {
  const { clearCandidateAlert } = useData();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const now = new Date();

  // Calculate alerts for this specific role
  const qualifiedAlerts = candidates.filter(c => {
    if (c.currentStage !== 'qualified') return false;
    const daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate >= 3;
  }).map(c => ({
    candidate: c,
    daysInStage: Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }));

  const twillScreenAlerts = candidates.filter(c => {
    if (c.currentStage !== 'twill_interview') return false;
    const daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate >= 3;
  }).map(c => ({
    candidate: c,
    daysInStage: Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }));

  const newSubmissions = candidates.filter(c => c.currentStage === 'no_status').map(c => ({
    candidate: c,
    daysInStage: 0
  }));

  const clientProcessAlerts = candidates.filter(c => {
    if (c.currentStage !== 'in_client_process') return false;
    const daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (c.alertCleared && c.alertClearedDate) {
      const daysSinceCleared = Math.floor(
        (now.getTime() - new Date(c.alertClearedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceCleared >= 5;
    }
    return daysSinceUpdate >= 5;
  }).map(c => ({
    candidate: c,
    daysInStage: Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }));

  const finalStagesAlerts = candidates.filter(c => {
    if (c.currentStage !== 'final_stages') return false;
    const daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (c.alertCleared && c.alertClearedDate) {
      const daysSinceCleared = Math.floor(
        (now.getTime() - new Date(c.alertClearedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceCleared >= 3;
    }
    return daysSinceUpdate >= 3;
  }).map(c => ({
    candidate: c,
    daysInStage: Math.floor(
      (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }));

  const totalAlerts = qualifiedAlerts.length + twillScreenAlerts.length + newSubmissions.length + clientProcessAlerts.length + finalStagesAlerts.length;

  // Don't show if no alerts
  if (totalAlerts === 0) {
    return null;
  }

  const handleCandidateClick = (candidateId: string) => {
    // Scroll to candidate and highlight
    router.push(`/dashboard/role/${role.id}?highlight=${candidateId}`);
    // Force scroll after navigation
    setTimeout(() => {
      const element = document.querySelector(`[data-candidate-id="${candidateId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handleClearAlert = (candidateId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearCandidateAlert(candidateId);
  };

  return (
    <Card className="overflow-hidden mb-4">
      <div className="p-4">
        {/* Collapsible Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Action Items</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalAlerts} item{totalAlerts !== 1 ? 's' : ''} requiring attention
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            {isExpanded ? (
              <>
                Collapse
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Expand
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="space-y-3 mt-4">
          {/* 1. Candidates Awaiting Status Assignment */}
          {newSubmissions.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-sm text-gray-700">
                  Candidates Awaiting Status Assignment
                </span>
                <Badge className="ml-auto shrink-0 bg-gray-500 hover:bg-gray-600 text-white">
                  {newSubmissions.length} candidate{newSubmissions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                {newSubmissions.map(({ candidate }) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                    onClick={() => handleCandidateClick(candidate.id)}
                  >
                    <span className="truncate group-hover:underline">
                      {candidate.name}
                    </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      Take action in kanban to clear alert
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Qualified 3+ Days */}
          {qualifiedAlerts.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-sm text-blue-600">
                  Qualified - 3+ Days Without Update
                </span>
                <Badge className="ml-auto shrink-0 bg-blue-500 hover:bg-blue-600 text-white">
                  {qualifiedAlerts.length} candidate{qualifiedAlerts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                {qualifiedAlerts.map(({ candidate, daysInStage }) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                    onClick={() => handleCandidateClick(candidate.id)}
                  >
                    <span className="truncate group-hover:underline">
                      {candidate.name} ({daysInStage}d)
                    </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      Take action in kanban to clear alert
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Twill Screen 3+ Days */}
          {twillScreenAlerts.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-sm text-blue-600">
                  Twill Screen - 3+ Days Without Update
                </span>
                <Badge className="ml-auto shrink-0 bg-blue-500 hover:bg-blue-600 text-white">
                  {twillScreenAlerts.length} candidate{twillScreenAlerts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                {twillScreenAlerts.map(({ candidate, daysInStage }) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                    onClick={() => handleCandidateClick(candidate.id)}
                  >
                    <span className="truncate group-hover:underline">
                      {candidate.name} ({daysInStage}d)
                    </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      Take action in kanban to clear alert
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Client Process 5+ Days */}
          {clientProcessAlerts.length > 0 && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-sm text-purple-600">
                  Client Process - 5+ Days Without Update
                </span>
                <Badge className="ml-auto shrink-0 bg-purple-500 hover:bg-purple-600 text-white">
                  {clientProcessAlerts.length} candidate{clientProcessAlerts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                {clientProcessAlerts.map(({ candidate, daysInStage }) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                    onClick={() => handleCandidateClick(candidate.id)}
                  >
                    <span className="truncate group-hover:underline">
                      {candidate.name} ({daysInStage}d)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleClearAlert(candidate.id, e)}
                      className="h-auto px-2 py-0.5 text-xs hover:bg-purple-100 shrink-0"
                    >
                      Clear Alert
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Final Stages 3+ Days */}
          {finalStagesAlerts.length > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-sm text-green-600">
                  Final Stages - 3+ Days Without Update
                </span>
                <Badge className="ml-auto shrink-0 bg-green-600 hover:bg-green-700 text-white">
                  {finalStagesAlerts.length} candidate{finalStagesAlerts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                {finalStagesAlerts.map(({ candidate, daysInStage }) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                    onClick={() => handleCandidateClick(candidate.id)}
                  >
                    <span className="truncate group-hover:underline">
                      {candidate.name} ({daysInStage}d)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleClearAlert(candidate.id, e)}
                      className="h-auto px-2 py-0.5 text-xs hover:bg-green-100 shrink-0"
                    >
                      Clear Alert
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </Card>
  );
}
