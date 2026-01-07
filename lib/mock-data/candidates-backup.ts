import { Candidate, PipelineStage, CandidateSource } from '@/types';
import { subDays } from 'date-fns';

// Helper to create candidates
const createCandidate = (
  id: string,
  name: string,
  roleId: string,
  source: CandidateSource,
  stage: PipelineStage,
  daysAgo: number,
  daysInStage: number = 1,
  memberPartnerId?: string,
  referringMemberId?: string
): Candidate => ({
  id,
  name,
  email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
  roleId,
  source,
  currentStage: stage,
  submittedDate: subDays(new Date(), daysAgo),
  stageEnteredDate: subDays(new Date(), daysInStage),
  lastUpdatedDate: subDays(new Date(), Math.max(0, daysInStage - 1)),
  memberNotified: stage !== 'submitted',
  memberPartnerId,
  referringMemberId,
});

export const mockCandidates: Candidate[] = [
  // Role 001 - Senior Frontend Engineer (Sarah Johnson)
  createCandidate('cand-001', 'Alice Johnson', 'role-001', 'member_referral', 'submitted', 10, 4, undefined, 'member-001'),
  createCandidate('cand-002', 'Bob Smith', 'role-001', 'member_partner', 'qualified', 15, 6, 'partner-001'),
  createCandidate('cand-003', 'Carol White', 'role-001', 'ta_sourced', 'twill_interview', 18, 2),
  createCandidate('cand-004', 'David Brown', 'role-001', 'member_referral', 'in_client_process', 25, 1, undefined, 'member-002'),
  createCandidate('cand-005', 'Eve Davis', 'role-001', 'member_partner', 'in_client_process', 20, 1, 'partner-002'),

  // Role 002 - Product Manager (Sarah Johnson)
  createCandidate('cand-006', 'Frank Miller', 'role-002', 'member_referral', 'submitted', 8, 3, undefined, 'member-003'),
  createCandidate('cand-007', 'Grace Lee', 'role-002', 'ta_sourced', 'qualified', 12, 7),
  createCandidate('cand-008', 'Henry Wilson', 'role-002', 'member_partner', 'final_stages', 22, 1, 'partner-003'),
  createCandidate('cand-009', 'Iris Martinez', 'role-002', 'member_referral', 'middle_stages', 18, 2, undefined, 'member-004'),
  createCandidate('cand-010', 'Jack Taylor', 'role-002', 'ta_sourced', 'signed_offer', 30, 0),

  // Role 003 - Backend Engineer (Sarah Johnson)
  createCandidate('cand-011', 'Kate Anderson', 'role-003', 'member_referral', 'submitted', 12, 5),
  createCandidate('cand-012', 'Liam Thomas', 'role-003', 'member_partner', 'in_client_process', 20, 3),
  createCandidate('cand-013', 'Mia Jackson', 'role-003', 'ta_sourced', 'in_client_process', 16, 1),

  // Role 004 - Data Scientist (Sarah Johnson)
  createCandidate('cand-014', 'Noah Harris', 'role-004', 'member_referral', 'qualified', 10, 8),
  createCandidate('cand-015', 'Olivia Clark', 'role-004', 'member_partner', 'in_client_process', 15, 2),
  createCandidate('cand-016', 'Peter Lewis', 'role-004', 'ta_sourced', 'middle_stages', 18, 1),
  createCandidate('cand-017', 'Quinn Walker', 'role-004', 'member_referral', 'final_stages', 12, 1),

  // Role 005 - UX Designer (Sarah Johnson - deprioritized)
  createCandidate('cand-018', 'Rachel Hall', 'role-005', 'member_referral', 'qualified', 30, 15),
  createCandidate('cand-019', 'Sam Allen', 'role-005', 'ta_sourced', 'twill_interview', 28, 10),

  // Role 006 - DevOps Engineer (Michael Chen)
  createCandidate('cand-020', 'Tina Young', 'role-006', 'member_referral', 'submitted', 8, 2),
  createCandidate('cand-021', 'Uma King', 'role-006', 'member_partner', 'twill_interview', 14, 1),
  createCandidate('cand-022', 'Victor Scott', 'role-006', 'ta_sourced', 'final_stages', 20, 1),
  createCandidate('cand-023', 'Wendy Green', 'role-006', 'member_referral', 'in_client_process', 16, 2),

  // Role 007 - Mobile Developer iOS (Michael Chen)
  createCandidate('cand-024', 'Xavier Adams', 'role-007', 'member_referral', 'submitted', 6, 3),
  createCandidate('cand-025', 'Yara Baker', 'role-007', 'member_partner', 'qualified', 10, 6),
  createCandidate('cand-026', 'Zack Nelson', 'role-007', 'ta_sourced', 'in_client_process', 15, 2),
  createCandidate('cand-027', 'Amy Carter', 'role-007', 'member_referral', 'middle_stages', 18, 1),

  // Role 008 - Engineering Manager (Michael Chen)
  createCandidate('cand-028', 'Ben Mitchell', 'role-008', 'member_referral', 'in_client_process', 20, 5),
  createCandidate('cand-029', 'Chloe Perez', 'role-008', 'member_partner', 'in_client_process', 16, 1),

  // Role 009 - Machine Learning Engineer (Michael Chen)
  createCandidate('cand-030', 'Dan Roberts', 'role-009', 'member_referral', 'submitted', 7, 2),
  createCandidate('cand-031', 'Ella Turner', 'role-009', 'member_partner', 'qualified', 12, 7),
  createCandidate('cand-032', 'Felix Phillips', 'role-009', 'ta_sourced', 'final_stages', 20, 1),
  createCandidate('cand-033', 'Gina Campbell', 'role-009', 'member_referral', 'in_client_process', 14, 2),

  // Role 010 - Security Engineer (Michael Chen)
  createCandidate('cand-034', 'Hugo Parker', 'role-010', 'member_referral', 'twill_interview', 15, 1),
  createCandidate('cand-035', 'Ivy Evans', 'role-010', 'member_partner', 'in_client_process', 18, 4),
  createCandidate('cand-036', 'Jake Edwards', 'role-010', 'ta_sourced', 'in_client_process', 12, 1),

  // Role 011 - Full Stack Engineer (Emily Rodriguez)
  createCandidate('cand-037', 'Kelly Collins', 'role-011', 'member_referral', 'submitted', 6, 2),
  createCandidate('cand-038', 'Leo Stewart', 'role-011', 'member_partner', 'qualified', 10, 8),
  createCandidate('cand-039', 'Maya Sanchez', 'role-011', 'ta_sourced', 'middle_stages', 18, 1),
  createCandidate('cand-040', 'Nate Morris', 'role-011', 'member_referral', 'final_stages', 14, 1),

  // Role 012 - QA Engineer (Emily Rodriguez)
  createCandidate('cand-041', 'Opal Rogers', 'role-012', 'member_referral', 'twill_interview', 20, 2),
  createCandidate('cand-042', 'Paul Reed', 'role-012', 'member_partner', 'in_client_process', 16, 3),

  // Role 013 - Technical Product Manager (Emily Rodriguez)
  createCandidate('cand-043', 'Quincy Cook', 'role-013', 'member_referral', 'submitted', 8, 3),
  createCandidate('cand-044', 'Rosa Morgan', 'role-013', 'member_partner', 'in_client_process', 15, 2),
  createCandidate('cand-045', 'Steve Bell', 'role-013', 'ta_sourced', 'middle_stages', 18, 1),

  // Role 014 - Site Reliability Engineer (Emily Rodriguez)
  createCandidate('cand-046', 'Tara Murphy', 'role-014', 'member_referral', 'qualified', 12, 9),
  createCandidate('cand-047', 'Umar Bailey', 'role-014', 'member_partner', 'in_client_process', 16, 2),
  createCandidate('cand-048', 'Vera Rivera', 'role-014', 'ta_sourced', 'middle_stages', 14, 1),

  // Role 015 - Solutions Architect (Emily Rodriguez)
  createCandidate('cand-049', 'Will Cooper', 'role-015', 'member_referral', 'twill_interview', 22, 3),
  createCandidate('cand-050', 'Xena Richardson', 'role-015', 'ta_sourced', 'in_client_process', 18, 1),

  // Role 016 - Frontend Developer React (David Park)
  createCandidate('cand-051', 'Yale Cox', 'role-016', 'member_referral', 'submitted', 5, 2),
  createCandidate('cand-052', 'Zoe Howard', 'role-016', 'member_partner', 'qualified', 9, 6),
  createCandidate('cand-053', 'Aaron Ward', 'role-016', 'ta_sourced', 'in_client_process', 14, 2),
  createCandidate('cand-054', 'Bella Torres', 'role-016', 'member_referral', 'middle_stages', 16, 1),

  // Role 017 - Data Engineer (David Park)
  createCandidate('cand-055', 'Carl Peterson', 'role-017', 'member_referral', 'twill_interview', 12, 2),
  createCandidate('cand-056', 'Dana Gray', 'role-017', 'member_partner', 'final_stages', 18, 1),
  createCandidate('cand-057', 'Ethan Ramirez', 'role-017', 'ta_sourced', 'in_client_process', 14, 1),

  // Role 018 - Platform Engineer (David Park)
  createCandidate('cand-058', 'Faye James', 'role-018', 'member_referral', 'in_client_process', 20, 4),
  createCandidate('cand-059', 'Gary Watson', 'role-018', 'member_partner', 'in_client_process', 16, 2),

  // Role 019 - Backend Engineer Node.js (David Park)
  createCandidate('cand-060', 'Hana Brooks', 'role-019', 'member_referral', 'submitted', 7, 3),
  createCandidate('cand-061', 'Ian Kelly', 'role-019', 'member_partner', 'qualified', 11, 7),
  createCandidate('cand-062', 'Jade Sanders', 'role-019', 'ta_sourced', 'middle_stages', 17, 1),

  // Role 020 - Product Designer (David Park)
  createCandidate('cand-063', 'Kyle Price', 'role-020', 'member_referral', 'twill_interview', 10, 2),
  createCandidate('cand-064', 'Luna Bennett', 'role-020', 'member_partner', 'in_client_process', 15, 3),
  createCandidate('cand-065', 'Mark Wood', 'role-020', 'ta_sourced', 'in_client_process', 13, 1),
];
