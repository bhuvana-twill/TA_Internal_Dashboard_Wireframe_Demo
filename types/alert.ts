export type AlertType =
  | 'referral_waiting'
  | 'screening_overdue'
  | 'low_candidate_count'
  | 'hire_notification'
  | 'weekly_screening_summary'
  | 'weekly_client_feedback_summary';

export type AlertPriority = 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  roleId?: string;
  candidateId?: string;
  message: string;
  createdDate: Date;
  dismissed: boolean;

  // Type-specific metadata
  businessDaysWaiting?: number;
  escalated?: boolean;
}
