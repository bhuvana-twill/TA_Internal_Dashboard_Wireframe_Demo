export type RolePriority = 'high' | 'low' | 'deprioritized';

export interface PipelineCounts {
  submittedReferrals: number;
  memberPartners: number;
  members: number;
  taSourcing: number;
  validatedCandidates: number;
  qualifiedAwaitingScreening: number;
  qualifiedScreened: number;
  disqualified: number;
  submittedToClient: number;

  // Client submission statuses
  awaitingClientFeedback: number;
  clientDisqualified: number;
  clientApproved: number;
  clientInterview1: number;
  clientInterview2: number;
  takeHomeExercise: number;
  referenceChecks: number;
  hired: number;
}

export interface Role {
  id: string;
  title: string;
  clientId: string;
  assignedTAId: string;
  priority: RolePriority;
  createdDate: Date;
  postedToPlatform: boolean;

  // Time metrics (in business days)
  timeToFirstSubmission?: number;
  timeToInClientProcess?: number; // Time to in-client process vs. qualified
  timeToQualified?: number; // Time to qualified

  // Revenue estimate (ballpark)
  estimatedRevenue?: number;

  // Pipeline counts (calculated from candidates)
  pipelineCounts: PipelineCounts;
}
