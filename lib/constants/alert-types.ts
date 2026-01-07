import { AlertType } from '@/types';

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  referral_waiting: 'Referral Waiting Too Long',
  screening_overdue: 'Screening Overdue',
  low_candidate_count: 'Low Active Candidates',
  hire_notification: 'New Hire!',
  weekly_screening_summary: 'Weekly Screening Summary',
  weekly_client_feedback_summary: 'Weekly Client Feedback Summary',
};

export const ALERT_TYPE_DESCRIPTIONS: Record<AlertType, string> = {
  referral_waiting: 'Referral has been waiting in review stage for more than 2 business days',
  screening_overdue: 'Candidate has been in screening stage for more than 5 business days',
  low_candidate_count: 'Role has fewer than 5 active candidates in the pipeline',
  hire_notification: 'Candidate has been successfully hired',
  weekly_screening_summary: 'Weekly summary of all candidates in screening stage',
  weekly_client_feedback_summary: 'Weekly summary of client feedback statistics',
};
