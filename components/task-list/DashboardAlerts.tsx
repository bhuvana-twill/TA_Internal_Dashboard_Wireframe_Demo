'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, AlertTriangle, Bell, Clock, TrendingUp } from 'lucide-react';
import { DashboardAlerts as DashboardAlertsType } from '@/lib/utils/alert-utils';

interface DashboardAlertsProps {
  alerts: DashboardAlertsType;
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't show if no alerts
  if (alerts.totalCount === 0) {
    return null;
  }

  const hasCritical = alerts.critical.noStatus5Days.length > 0;
  const hasUrgent = alerts.urgent.noStatus3Days.length > 0 || alerts.urgent.newSubmissions.length > 0;
  const hasWarning = alerts.warning.noStatus2Days.length > 0;

  return (
    <Card className="overflow-hidden border-l-4 border-l-destructive">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-lg">Dashboard Alerts</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alerts.totalCount} alert{alerts.totalCount !== 1 ? 's' : ''} requiring attention
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
          <div className="mt-4 space-y-4">
            {/* Critical Alerts */}
            {hasCritical && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-semibold text-sm text-destructive">
                    Critical: Candidates in No Status for 5+ days
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.critical.noStatus5Days.map(roleAlert => (
                    <Link
                      key={roleAlert.roleId}
                      href={`/dashboard/role/${roleAlert.roleId}`}
                      className="block hover:bg-background/50 rounded p-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {roleAlert.clientName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {roleAlert.roleTitle}
                          </div>
                        </div>
                        <Badge variant="destructive" className="ml-2 shrink-0">
                          {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Urgent Alerts */}
            {hasUrgent && (
              <div className="space-y-3">
                {/* No Status 3+ Days */}
                {alerts.urgent.noStatus3Days.length > 0 && (
                  <div className="rounded-lg border border-orange-500/30 bg-orange-50/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-sm text-orange-600">
                        Urgent: Candidates in No Status for 3+ days
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {alerts.urgent.noStatus3Days.map(roleAlert => (
                        <Link
                          key={roleAlert.roleId}
                          href={`/dashboard/role/${roleAlert.roleId}`}
                          className="block hover:bg-background/50 rounded p-2 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {roleAlert.clientName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {roleAlert.roleTitle}
                              </div>
                            </div>
                            <Badge className="ml-2 shrink-0 bg-orange-500 hover:bg-orange-600">
                              {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Submissions */}
                {alerts.urgent.newSubmissions.length > 0 && (
                  <div className="rounded-lg border border-blue-500/30 bg-blue-50/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-sm text-blue-600">
                        New: Candidates submitted in last 24 hours
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {alerts.urgent.newSubmissions.map(roleAlert => (
                        <Link
                          key={roleAlert.roleId}
                          href={`/dashboard/role/${roleAlert.roleId}`}
                          className="block hover:bg-background/50 rounded p-2 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {roleAlert.clientName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {roleAlert.roleTitle}
                              </div>
                            </div>
                            <Badge className="ml-2 shrink-0 bg-blue-500 hover:bg-blue-600">
                              {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Warning Alerts */}
            {hasWarning && !hasCritical && !hasUrgent && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-50/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-semibold text-sm text-yellow-600">
                    Watch: Candidates in No Status for 2+ days
                  </span>
                </div>
                <div className="space-y-1.5">
                  {alerts.warning.noStatus2Days.map(roleAlert => (
                    <Link
                      key={roleAlert.roleId}
                      href={`/dashboard/role/${roleAlert.roleId}`}
                      className="block hover:bg-background/50 rounded p-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {roleAlert.clientName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {roleAlert.roleTitle}
                          </div>
                        </div>
                        <Badge className="ml-2 shrink-0 bg-yellow-500 hover:bg-yellow-600">
                          {roleAlert.candidates.length} candidate{roleAlert.candidates.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </Link>
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
