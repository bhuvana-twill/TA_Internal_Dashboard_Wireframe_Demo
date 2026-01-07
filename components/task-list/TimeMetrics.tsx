import { Clock } from 'lucide-react';

interface TimeMetricsProps {
  timeToFirstSubmission?: number;
  timeToInClientProcess?: number;
  timeToQualified?: number;
}

export function TimeMetrics({
  timeToFirstSubmission,
  timeToInClientProcess,
  timeToQualified,
}: TimeMetricsProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <Clock className="h-4 w-4" />
      <div className="flex gap-4">
        {timeToFirstSubmission !== undefined && (
          <div>
            <span className="font-medium">{timeToFirstSubmission}d</span> Time to 1st submit
          </div>
        )}
        {timeToInClientProcess !== undefined && (
          <div>
            <span className="font-medium">{timeToInClientProcess}d</span> Time to in-client process
          </div>
        )}
        {timeToQualified !== undefined && (
          <div>
            <span className="font-medium">{timeToQualified}d</span> Time to qualified
          </div>
        )}
      </div>
    </div>
  );
}
