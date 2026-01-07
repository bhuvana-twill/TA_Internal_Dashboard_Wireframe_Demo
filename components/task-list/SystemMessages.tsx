'use client';

import { Candidate } from '@/types';
import { getBusinessDaysSince } from '@/lib/utils/date-utils';
import { AlertCircle, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemMessagesProps {
  candidates: Candidate[];
}

export function SystemMessages({ candidates }: SystemMessagesProps) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // New candidates submitted in last 24 hours
  const newCandidates = candidates.filter(c => {
    const submittedDate = new Date(c.submittedDate);
    return submittedDate >= oneDayAgo;
  });

  // Candidates in no_status for different thresholds
  const noStatusCandidates = candidates.filter(c => c.currentStage === 'no_status');
  const noStatus2Days = noStatusCandidates.filter(c => getBusinessDaysSince(c.stageEnteredDate) >= 2);
  const noStatus3Days = noStatusCandidates.filter(c => getBusinessDaysSince(c.stageEnteredDate) >= 3);
  const noStatus5Days = noStatusCandidates.filter(c => getBusinessDaysSince(c.stageEnteredDate) >= 5);

  const messages: Array<{ type: 'info' | 'warning' | 'error'; text: string }> = [];

  // New candidate messages
  if (newCandidates.length > 0) {
    messages.push({
      type: 'info',
      text: `${newCandidates.length} new candidate${newCandidates.length !== 1 ? 's' : ''} submitted.`
    });
  }

  // No status messages (show most urgent first)
  if (noStatus5Days.length > 0) {
    messages.push({
      type: 'error',
      text: `${noStatus5Days.length} candidate${noStatus5Days.length !== 1 ? 's' : ''} in "No Status" for more than 5 days.`
    });
  } else if (noStatus3Days.length > 0) {
    messages.push({
      type: 'warning',
      text: `${noStatus3Days.length} candidate${noStatus3Days.length !== 1 ? 's' : ''} in "No Status" for more than 3 days.`
    });
  } else if (noStatus2Days.length > 0) {
    messages.push({
      type: 'warning',
      text: `${noStatus2Days.length} candidate${noStatus2Days.length !== 1 ? 's' : ''} in "No Status" for more than 2 days.`
    });
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg border',
            message.type === 'error' && 'bg-red-50 border-red-200',
            message.type === 'warning' && 'bg-yellow-50 border-yellow-200',
            message.type === 'info' && 'bg-blue-50 border-blue-200'
          )}
        >
          {message.type === 'info' ? (
            <UserPlus className={cn('h-4 w-4', message.type === 'info' && 'text-blue-600')} />
          ) : (
            <AlertCircle className={cn(
              'h-4 w-4',
              message.type === 'error' && 'text-red-600',
              message.type === 'warning' && 'text-yellow-600'
            )} />
          )}
          <span className={cn(
            'text-sm',
            message.type === 'error' && 'text-red-900 font-medium',
            message.type === 'warning' && 'text-yellow-900',
            message.type === 'info' && 'text-blue-900'
          )}>
            {message.text}
          </span>
        </div>
      ))}
    </div>
  );
}

