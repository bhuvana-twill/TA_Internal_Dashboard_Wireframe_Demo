'use client';

import { Alert } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ALERT_TYPE_LABELS } from '@/lib/constants/alert-types';
import { formatRelativeTime } from '@/lib/utils/date-utils';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  onDismiss: (alertId: string) => void;
}

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const priorityConfig = {
    high: {
      icon: AlertTriangle,
      className: 'border-red-500 bg-red-50',
      badgeClassName: 'bg-red-100 text-red-800 border-red-300',
    },
    medium: {
      icon: AlertCircle,
      className: 'border-yellow-500 bg-yellow-50',
      badgeClassName: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    low: {
      icon: Info,
      className: 'border-blue-500 bg-blue-50',
      badgeClassName: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  };

  const config = priorityConfig[alert.priority];
  const Icon = config.icon;

  return (
    <Card className={cn('relative', config.className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Icon className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">
                {ALERT_TYPE_LABELS[alert.type]}
              </CardTitle>
              <CardDescription className="mt-1">
                {alert.message}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={config.badgeClassName}>
              {alert.priority.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDismiss(alert.id)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelativeTime(alert.createdDate)}</span>
          {alert.businessDaysWaiting !== undefined && (
            <span className="font-medium">
              {alert.businessDaysWaiting} business days
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
