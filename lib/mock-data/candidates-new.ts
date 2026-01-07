import { Candidate, PipelineStage, CandidateSource } from '@/types';
import { subDays, subHours } from 'date-fns';

const createCandidate = (
  id: string,
  name: string,
  email: string,
  roleId: string,
  source: CandidateSource,
  stage: PipelineStage,
  daysAgo: number = 5,
  stageDaysAgo?: number
): Candidate => ({
  id,
  name,
  email,
  roleId,
  source,
  currentStage: stage,
  submittedDate: subDays(new Date(), daysAgo),
  stageEnteredDate: subDays(new Date(), stageDaysAgo ?? Math.max(1, Math.floor(daysAgo / 2))),
  lastUpdatedDate: subDays(new Date(), 1),
  memberNotified: stage !== 'no_status',
});

export const mockCandidates: Candidate[] = [
  // Role 001 - Senior Frontend Engineer
  // New candidate submitted today
  {
    id: 'cand-001-new',
    name: 'New Candidate A',
    email: 'new.a@example.com',
    roleId: 'role-001',
    source: 'member_referral',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 8), // Submitted 8 hours ago
    stageEnteredDate: subHours(new Date(), 8),
    lastUpdatedDate: subHours(new Date(), 8),
    memberNotified: true,
  },
  createCandidate('cand-001', 'Alice Johnson', 'alice.j@example.com', 'role-001', 'member_referral', 'no_status', 2, 2),
  createCandidate('cand-002', 'Bob Smith', 'bob.s@example.com', 'role-001', 'member_partner', 'qualified', 5),
  createCandidate('cand-003', 'Carol White', 'carol.w@example.com', 'role-001', 'ta_sourced', 'twill_interview', 7),
  createCandidate('cand-004', 'David Brown', 'david.b@example.com', 'role-001', 'member_referral', 'submitted', 10),
  createCandidate('cand-005', 'Eve Davis', 'eve.d@example.com', 'role-001', 'member_partner', 'in_client_process', 15),
  createCandidate('cand-006', 'Frank Miller', 'frank.m@example.com', 'role-001', 'ta_sourced', 'middle_stages', 20),
  createCandidate('cand-007', 'Grace Lee', 'grace.l@example.com', 'role-001', 'member_referral', 'unqualified', 8),
  createCandidate('cand-008', 'Henry Wilson', 'henry.w@example.com', 'role-001', 'member_partner', 'fit_and_hold', 6),

  // Role 002 - Product Manager
  // New candidate submitted today
  {
    id: 'cand-009-new',
    name: 'New Candidate B',
    email: 'new.b@example.com',
    roleId: 'role-002',
    source: 'ta_sourced',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 6), // Submitted 6 hours ago
    stageEnteredDate: subHours(new Date(), 6),
    lastUpdatedDate: subHours(new Date(), 6),
    memberNotified: true,
  },
  // Candidate in no_status for 5+ days
  createCandidate('cand-009', 'Iris Martinez', 'iris.m@example.com', 'role-002', 'member_referral', 'no_status', 6, 6),
  createCandidate('cand-010', 'Jack Taylor', 'jack.t@example.com', 'role-002', 'ta_sourced', 'qualified', 4),
  createCandidate('cand-011', 'Kate Anderson', 'kate.a@example.com', 'role-002', 'member_partner', 'submitted', 8),
  createCandidate('cand-012', 'Liam Thomas', 'liam.t@example.com', 'role-002', 'member_referral', 'intro_request_made', 12),
  createCandidate('cand-013', 'Mia Jackson', 'mia.j@example.com', 'role-002', 'ta_sourced', 'final_stages', 25),
  createCandidate('cand-014', 'Noah Harris', 'noah.h@example.com', 'role-002', 'member_partner', 'verbal_offer', 30),

  // Role 003 - Backend Engineer
  createCandidate('cand-015', 'Olivia Clark', 'olivia.c@example.com', 'role-003', 'member_referral', 'no_status', 3),
  createCandidate('cand-016', 'Peter Lewis', 'peter.l@example.com', 'role-003', 'member_partner', 'qualified', 6),
  createCandidate('cand-017', 'Quinn Walker', 'quinn.w@example.com', 'role-003', 'ta_sourced', 'twill_interview', 9),
  createCandidate('cand-018', 'Rachel Hall', 'rachel.h@example.com', 'role-003', 'member_referral', 'rejection_0', 14),

  // Role 004 - Data Scientist (with alerts)
  // New candidate submitted today
  {
    id: 'cand-019-new',
    name: 'Alex Rivera',
    email: 'alex.r@example.com',
    roleId: 'role-004',
    source: 'member_referral',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 12), // Submitted 12 hours ago
    stageEnteredDate: subHours(new Date(), 12),
    lastUpdatedDate: subHours(new Date(), 12),
    memberNotified: true,
  },
  // Candidates in no_status for different durations
  createCandidate('cand-019', 'Sam Allen', 'sam.a@example.com', 'role-004', 'member_partner', 'no_status', 6, 6), // 6 days in no_status
  createCandidate('cand-019b', 'Ben Carter', 'ben.c@example.com', 'role-004', 'ta_sourced', 'no_status', 4, 4), // 4 days in no_status
  createCandidate('cand-019c', 'Chris Moore', 'chris.m@example.com', 'role-004', 'member_referral', 'no_status', 3, 3), // 3 days in no_status
  createCandidate('cand-019d', 'Dana Foster', 'dana.f@example.com', 'role-004', 'member_partner', 'no_status', 2, 2), // 2 days in no_status
  createCandidate('cand-020', 'Tina Young', 'tina.y@example.com', 'role-004', 'ta_sourced', 'qualified', 5),
  createCandidate('cand-021', 'Uma King', 'uma.k@example.com', 'role-004', 'member_referral', 'in_client_process', 11),
  createCandidate('cand-022', 'Victor Scott', 'victor.s@example.com', 'role-004', 'member_partner', 'rejection_1', 16),
  createCandidate('cand-023', 'Wendy Green', 'wendy.g@example.com', 'role-004', 'ta_sourced', 'signed_offer', 35),

  // Add more candidates for other roles...
  createCandidate('cand-024', 'Xavier Adams', 'xavier.a@example.com', 'role-006', 'member_referral', 'qualified', 4),
  createCandidate('cand-025', 'Yara Baker', 'yara.b@example.com', 'role-006', 'member_partner', 'submitted', 8),
  createCandidate('cand-026', 'Zack Nelson', 'zack.n@example.com', 'role-007', 'ta_sourced', 'in_client_process', 12),
  createCandidate('cand-027', 'Amy Carter', 'amy.c@example.com', 'role-007', 'member_referral', 'final_stages', 20),
];
