'use client';

import { Alert } from '@/types';
import { AlertCard } from './AlertCard';

interface AlertListProps {
  alerts: Alert[];
  onDismiss: (alertId: string) => void;
}

export function AlertList({ alerts, onDismiss }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">No active alerts</p>
        <p className="text-sm text-muted-foreground mt-1">All caught up! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
