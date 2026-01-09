import { RolePriority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: RolePriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    high: {
      label: 'High Priority',
      className: 'bg-primary text-primary-foreground border-primary',
      description: 'Client responsive, ready to hire',
    },
    low: {
      label: 'Low Priority',
      className: 'bg-gray-100 text-gray-800 border-gray-300',
      description: 'Client accepting candidates opportunistically',
    },
    deprioritized: {
      label: 'De-prioritized',
      className: 'bg-gray-100 text-gray-600 border-gray-300',
      description: 'Client needs to pause',
    },
  };

  const { label, className } = config[priority];

  return (
    <Badge variant="outline" className={cn(className)}>
      {label}
    </Badge>
  );
}
