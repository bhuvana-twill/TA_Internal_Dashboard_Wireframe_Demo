export type ChecklistCategory =
  | 'client_onboarding'
  | 'candidate_review_screening'
  | 'quality_control'
  | 'client_submission_tracking'
  | 'member_notifications';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  description: string;
  completed: boolean;
  completedDate?: Date;
  roleId?: string; // Some tasks are role-specific
  order: number;
}

export interface ChecklistSection {
  category: ChecklistCategory;
  title: string;
  description: string;
  items: ChecklistItem[];
}
