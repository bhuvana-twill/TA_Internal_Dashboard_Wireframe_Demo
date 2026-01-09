'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bell, Clock } from 'lucide-react';
import { DashboardAlerts as DashboardAlertsType } from '@/lib/utils/alert-utils';
import { useData } from '@/contexts/DataContext';
import { useCurrentUser } from '@/contexts/UserContext';

interface DashboardAlertsProps {
  alerts: DashboardAlertsType;
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { clearCandidateAlert } = useData();
  const { userRole } = useCurrentUser();
  const router = useRouter();

  // Don't show if no alerts
  if (alerts.totalCount === 0) {
    return null;
  }

  const hasCritical = alerts.critical.clientProcess5Days.length > 0;
  const hasUrgent =
    alerts.urgent.newSubmissions.length > 0 ||
    alerts.urgent.qualified3Days.length > 0 ||
    alerts.urgent.twillScreen3Days.length > 0 ||
    alerts.urgent.finalStages3Days.length > 0;

  const handleCandidateClick = (roleId: string, candidateId: string) => {
    // Navigate to role page with candidate ID as query param for highlighting
    router.push(`/dashboard/role/${roleId}?highlight=${candidateId}`);
  };

  const handleClearAlert = (candidateId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearCandidateAlert(candidateId);
  };

  return (
    <Card className={`overflow-hidden border-l-4 ${userRole === 'ta' ? 'border-l-destructive shadow-[0_4px_12px_rgba(239,68,68,0.2)]' : 'border-l-primary'}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className={`h-5 w-5 ${userRole === 'ta' ? 'text-destructive' : 'text-primary'}`} />
            <div>
              <h3 className="font-semibold text-lg">Action Items</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alerts.totalCount} item{alerts.totalCount !== 1 ? 's' : ''} requiring attention
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

        {/* Alert Details */}
        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* 1. Qualified 3+ Days */}
            {alerts.urgent.qualified3Days.length > 0 && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm text-blue-600">
                    Qualified - 3+ Days Without Update
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.urgent.qualified3Days.map(roleAlert => (
                    <div key={roleAlert.roleId} className="space-y-1">
                      {/* Non-clickable role header */}
                      <div className="p-2 bg-background/30 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {roleAlert.clientName} - {roleAlert.roleTitle}
                            </div>
                          </div>
                          <Badge className="ml-2 shrink-0 bg-blue-500 hover:bg-blue-600 text-white">
                            {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      {/* Clickable candidate cards */}
                      <div className="ml-2 space-y-1">
                        {roleAlert.candidates.map(candAlert => (
                          <div
                            key={candAlert.candidate.id}
                            className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                            onClick={() => handleCandidateClick(roleAlert.roleId, candAlert.candidate.id)}
                          >
                            <span className="truncate group-hover:underline">
                              {candAlert.candidate.name} ({candAlert.daysInStage}d)
                            </span>
                            <span className="text-muted-foreground text-xs shrink-0">
                              Take action in kanban to clear alert
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Twill Screen 3+ Days */}
            {alerts.urgent.twillScreen3Days.length > 0 && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm text-blue-600">
                    Twill Screen - 3+ Days Without Update
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.urgent.twillScreen3Days.map(roleAlert => (
                    <div key={roleAlert.roleId} className="space-y-1">
                      {/* Non-clickable role header */}
                      <div className="p-2 bg-background/30 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {roleAlert.clientName} - {roleAlert.roleTitle}
                            </div>
                          </div>
                          <Badge className="ml-2 shrink-0 bg-blue-500 hover:bg-blue-600 text-white">
                            {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      {/* Clickable candidate cards */}
                      <div className="ml-2 space-y-1">
                        {roleAlert.candidates.map(candAlert => (
                          <div
                            key={candAlert.candidate.id}
                            className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                            onClick={() => handleCandidateClick(roleAlert.roleId, candAlert.candidate.id)}
                          >
                            <span className="truncate group-hover:underline">
                              {candAlert.candidate.name} ({candAlert.daysInStage}d)
                            </span>
                            <span className="text-muted-foreground text-xs shrink-0">
                              Take action in kanban to clear alert
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. New Submissions */}
            {alerts.urgent.newSubmissions.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-semibold text-sm text-gray-700">
                    Candidates Awaiting Status Assignment
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.urgent.newSubmissions.map(roleAlert => (
                    <div key={roleAlert.roleId} className="space-y-1">
                      {/* Non-clickable role header */}
                      <div className="p-2 bg-background/30 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {roleAlert.clientName} - {roleAlert.roleTitle}
                            </div>
                          </div>
                          <Badge className="ml-2 shrink-0 bg-gray-500 hover:bg-gray-600 text-white">
                            {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      {/* Clickable candidate cards */}
                      <div className="ml-2 space-y-1">
                        {roleAlert.candidates.map(candAlert => (
                          <div
                            key={candAlert.candidate.id}
                            className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                            onClick={() => handleCandidateClick(roleAlert.roleId, candAlert.candidate.id)}
                          >
                            <span className="truncate group-hover:underline">
                              {candAlert.candidate.name}
                            </span>
                            <span className="text-muted-foreground text-xs shrink-0">
                              Take action in kanban to clear alert
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Client Process 5+ Days */}
            {hasCritical && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold text-sm text-purple-600">
                    Client Process - 5+ Days Without Update
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.critical.clientProcess5Days.map(roleAlert => (
                    <div key={roleAlert.roleId} className="space-y-1">
                      {/* Non-clickable role header */}
                      <div className="p-2 bg-background/30 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {roleAlert.clientName} - {roleAlert.roleTitle}
                            </div>
                          </div>
                          <Badge className="ml-2 shrink-0 bg-purple-500 hover:bg-purple-600 text-white">
                            {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      {/* Clickable candidate cards */}
                      <div className="ml-2 space-y-1">
                        {roleAlert.candidates.map(candAlert => (
                          <div
                            key={candAlert.candidate.id}
                            className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                            onClick={() => handleCandidateClick(roleAlert.roleId, candAlert.candidate.id)}
                          >
                            <span className="truncate group-hover:underline">
                              {candAlert.candidate.name} ({candAlert.daysInStage}d)
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleClearAlert(candAlert.candidate.id, e)}
                              className="h-auto px-2 py-0.5 text-xs hover:bg-purple-100 shrink-0"
                            >
                              Clear Alert
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Final Stages 3+ Days */}
            {alerts.urgent.finalStages3Days.length > 0 && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-sm text-green-600">
                    Final Stages - 3+ Days Without Update
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.urgent.finalStages3Days.map(roleAlert => (
                    <div key={roleAlert.roleId} className="space-y-1">
                      {/* Non-clickable role header */}
                      <div className="p-2 bg-background/30 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {roleAlert.clientName} - {roleAlert.roleTitle}
                            </div>
                          </div>
                          <Badge className="ml-2 shrink-0 bg-green-600 hover:bg-green-700 text-white">
                            {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      {/* Clickable candidate cards */}
                      <div className="ml-2 space-y-1">
                        {roleAlert.candidates.map(candAlert => (
                          <div
                            key={candAlert.candidate.id}
                            className="flex items-center justify-between text-xs bg-background/50 rounded px-2 py-1 hover:bg-background/70 transition-colors cursor-pointer group"
                            onClick={() => handleCandidateClick(roleAlert.roleId, candAlert.candidate.id)}
                          >
                            <span className="truncate group-hover:underline">
                              {candAlert.candidate.name} ({candAlert.daysInStage}d)
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleClearAlert(candAlert.candidate.id, e)}
                              className="h-auto px-2 py-0.5 text-xs hover:bg-green-100 shrink-0"
                            >
                              Clear Alert
                            </Button>
                          </div>
                        ))}
                      </div>
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
