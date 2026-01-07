import { PipelineStage } from '@/types';

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  no_status: 'No Status',
  qualified: 'Qualified',
  unqualified: 'Unqualified',
  fit_and_hold: 'Fit & Hold',
  twill_interview: 'Twill Interview',
  submitted: 'Submitted',
  rejection_0: 'Rejection 0',
  intro_request_made: 'Intro Request Made',
  in_client_process: 'In Client Process',
  rejection_1: 'Rejection 1',
  middle_stages: 'Middle Stages',
  rejection_2: 'Rejection 2',
  final_stages: 'Final Stages',
  verbal_offer: 'Verbal Offer',
  signed_offer: 'Signed Offer',
};

export const PIPELINE_STAGES: PipelineStage[] = [
  'no_status',
  'qualified',
  'unqualified',
  'fit_and_hold',
  'twill_interview',
  'submitted',
  'rejection_0',
  'intro_request_made',
  'in_client_process',
  'rejection_1',
  'middle_stages',
  'rejection_2',
  'final_stages',
  'verbal_offer',
  'signed_offer',
];
