import { Clock } from 'lucide-react';

interface TimeMetricsProps {
  timeToFirstSubmission?: number;
  timeToFirstQualifiedSubmission?: number;
  timeToFirstFiveQualifiedSubmissions?: number;
}

export function TimeMetrics({
  timeToFirstSubmission,
  timeToFirstQualifiedSubmission,
  timeToFirstFiveQualifiedSubmissions,
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
        {timeToFirstQualifiedSubmission !== undefined && (
          <div>
            <span className="font-medium">{timeToFirstQualifiedSubmission}d</span> Time to 1st qualified
          </div>
        )}
        {timeToFirstFiveQualifiedSubmissions !== undefined && (
          <div>
            <span className="font-medium">{timeToFirstFiveQualifiedSubmissions}d</span> Time to 5 qualified
          </div>
        )}
      </div>
    </div>
  );
}
