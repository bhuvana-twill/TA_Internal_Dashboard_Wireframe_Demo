export interface FunnelMetrics {
  memberReferrals: number;
  memberPartnerReferrals: number;
  taSourced: number;
  total: number;
}

export interface TurnaroundMetrics {
  averageDays: number;
  within1Day: number;
  within3Days: number;
  within5Days: number;
  over5Days: number;
}

export interface ClientMetrics {
  totalSubmissions: number;
  clientApprovals: number;
  approvalRate: number;
}

export interface RoleMetrics {
  roleId: string;
  activeCandidates: number;
  timeToFirstFive?: number;
  clientApprovals: number;
  fallThroughCount: number; // Candidates stuck in stages
}

export interface DashboardMetrics {
  topOfFunnel: FunnelMetrics;
  screeningTurnaround: TurnaroundMetrics;
  clientPerformance: ClientMetrics;
  activeCandidatesPerRole: Record<string, number>;
  totalPlacements: number;

  // Calculated per role
  roleMetrics: Record<string, RoleMetrics>;
}
