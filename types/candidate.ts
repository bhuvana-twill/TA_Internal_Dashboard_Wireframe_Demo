export type CandidateSource =
  | 'member_referral'
  | 'member_partner'
  | 'ta_sourced';

export type PipelineStage =
  | 'no_status'
  | 'qualified'
  | 'unqualified'
  | 'fit_and_hold'
  | 'twill_interview'
  | 'submitted'
  | 'rejection_0'
  | 'intro_request_made'
  | 'in_client_process'
  | 'rejection_1'
  | 'middle_stages'
  | 'rejection_2'
  | 'final_stages'
  | 'verbal_offer'
  | 'signed_offer';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  roleId: string;
  source: CandidateSource;
  currentStage: PipelineStage;

  // Timestamps for stage tracking
  submittedDate: Date;
  stageEnteredDate: Date; // When entered current stage
  lastUpdatedDate: Date;

  // Stage-specific data
  referringMemberId?: string;
  screeningScheduledDate?: Date;
  screeningCompletedDate?: Date;
  disqualificationReason?: string;
  clientFeedback?: string;

  // Flags
  memberNotified: boolean;
}
