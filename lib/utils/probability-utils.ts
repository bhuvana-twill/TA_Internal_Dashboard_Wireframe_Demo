import { Candidate, PipelineStage } from '@/types';

/**
 * Calculate probability of placement based on the stage the majority of candidates are in
 */
export function calculatePlacementProbability(candidates: Candidate[]): number {
  if (candidates.length === 0) return 0;

  // Count candidates by stage
  const stageCounts = candidates.reduce((acc, candidate) => {
    const stage = candidate.currentStage;
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<PipelineStage, number>);

  // Find the stage with the most candidates
  let maxCount = 0;
  let majorityStage: PipelineStage | null = null;
  
  for (const [stage, count] of Object.entries(stageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      majorityStage = stage as PipelineStage;
    }
  }

  if (!majorityStage) return 0;

  // Map stages to probability percentages
  const stageProbabilities: Record<PipelineStage, number> = {
    no_status: 5,
    qualified: 15,
    unqualified: 0,
    fit_and_hold: 10,
    twill_interview: 20,
    submitted: 25,
    rejection_0: 0,
    intro_request_made: 30,
    in_client_process: 40,
    rejection_1: 0,
    middle_stages: 50,
    rejection_2: 0,
    final_stages: 70,
    verbal_offer: 85,
    signed_offer: 100,
  };

  return stageProbabilities[majorityStage] || 0;
}

