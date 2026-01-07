import { PipelineStage } from '@/types';

/**
 * Returns context-aware next stage suggestions for a candidate's current stage.
 * These are the most common workflows TAs use, optimized to reduce clicks.
 */
export function getQuickMoveOptions(currentStage: PipelineStage): PipelineStage[] {
  const quickMoveMap: Record<PipelineStage, PipelineStage[]> = {
    // Initial screening - most common: qualify or disqualify
    no_status: ['qualified', 'unqualified', 'fit_and_hold'],

    // Qualified - advance to interview or change mind
    qualified: ['twill_interview', 'unqualified'],

    // Unqualified - rarely moves, but allow fit & hold
    unqualified: ['fit_and_hold'],

    // Fit & Hold - might qualify for different role or this one
    fit_and_hold: ['qualified', 'unqualified'],

    // After TA interview - submit or disqualify
    twill_interview: ['submitted', 'qualified', 'unqualified'],

    // Submitted to client - binary decision
    submitted: ['intro_request_made', 'rejection_0'],

    // Client rejected before interview - rarely moves
    rejection_0: ['submitted'], // In case of mistake

    // Client wants intro - move to process or they ghost
    intro_request_made: ['in_client_process', 'rejection_0'],

    // In client process - advance or reject
    in_client_process: ['middle_stages', 'rejection_1'],

    // Rejected after 1 interview - rarely moves
    rejection_1: ['in_client_process'], // In case of mistake

    // Middle stages - advance or reject
    middle_stages: ['final_stages', 'rejection_2'],

    // Rejected after multiple interviews - rarely moves
    rejection_2: ['middle_stages'], // In case of mistake

    // Final stages - offer or reject
    final_stages: ['verbal_offer', 'rejection_2'],

    // Verbal offer - sign or fall through
    verbal_offer: ['signed_offer', 'final_stages'],

    // Signed offer - done! Rarely moves
    signed_offer: [],
  };

  return quickMoveMap[currentStage] || [];
}

/**
 * Returns whether a stage is considered "urgent" based on time spent
 * Matches Slack notification thresholds:
 * - Review stage (no_status): Ping at 2BD, escalate at 3BD
 * - Screening stage (qualified): Ping at 5BD
 */
export function isStageUrgent(stage: PipelineStage, daysInStage: number): boolean {
  const urgencyThresholds: Partial<Record<PipelineStage, number>> = {
    no_status: 2, // Slack ping at 2BD (review stage)
    qualified: 5, // Slack ping at 5BD (screening stage)
    twill_interview: 3,
    submitted: 3,
    intro_request_made: 3,
    in_client_process: 7,
    middle_stages: 7,
    final_stages: 5,
    verbal_offer: 3,
  };

  const threshold = urgencyThresholds[stage];
  return threshold ? daysInStage >= threshold : false;
}

/**
 * Returns the color coding level based on waiting time and stage
 * Returns: 'warning' (yellow) | 'urgent' (orange) | 'critical' (red) | null
 */
export function getWaitingTimeColorLevel(stage: PipelineStage, daysInStage: number): 'warning' | 'urgent' | 'critical' | null {
  // Review stage (no_status): Yellow at 2BD, Red at 3BD (escalation)
  if (stage === 'no_status') {
    if (daysInStage >= 3) return 'critical'; // Escalation notification
    if (daysInStage >= 2) return 'urgent';   // Initial ping
    return null;
  }

  // Screening stage (qualified): Yellow at 4BD, Red at 5BD
  if (stage === 'qualified') {
    if (daysInStage >= 5) return 'critical'; // Slack ping threshold
    if (daysInStage >= 4) return 'warning';  // Warning before ping
    return null;
  }

  // Other stages: Use standard urgency threshold
  const urgencyThresholds: Partial<Record<PipelineStage, number>> = {
    twill_interview: 3,
    submitted: 3,
    intro_request_made: 3,
    in_client_process: 7,
    middle_stages: 7,
    final_stages: 5,
    verbal_offer: 3,
  };

  const threshold = urgencyThresholds[stage];
  if (threshold && daysInStage >= threshold) {
    return 'urgent';
  }

  return null;
}
