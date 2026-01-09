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
  stageDaysAgo?: number,
  lastUpdateDaysAgo?: number,
  memberPartnerId?: string,
  referringMemberId?: string
): Candidate => ({
  id,
  name,
  email,
  roleId,
  source,
  currentStage: stage,
  submittedDate: subDays(new Date(), daysAgo),
  stageEnteredDate: subDays(new Date(), stageDaysAgo ?? Math.max(1, Math.floor(daysAgo / 2))),
  lastUpdatedDate: subDays(new Date(), lastUpdateDaysAgo ?? 1),
  memberNotified: stage !== 'no_status',
  ...(memberPartnerId && { memberPartnerId }),
  ...(referringMemberId && { referringMemberId }),
});

export const mockCandidates: Candidate[] = [
  // ===============================================
  // Role 001 - Senior Frontend Engineer (TechCorp)
  // Demonstrating ALL 5 alert types for Sarah Johnson
  // ===============================================

  // ALERT TYPE 1: New Submission (submitted in last 24 hours)
  {
    id: 'cand-001-new-alert',
    name: 'Emma Watson',
    email: 'emma.watson@example.com',
    roleId: 'role-001',
    source: 'member_referral',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 8), // Submitted 8 hours ago
    stageEnteredDate: subHours(new Date(), 8),
    lastUpdatedDate: subHours(new Date(), 8),
    memberNotified: true,
    referringMemberId: 'member-001',
  },
  {
    id: 'cand-001-new-alert-2',
    name: 'Liam Neeson',
    email: 'liam.neeson@example.com',
    roleId: 'role-001',
    source: 'member_partner',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 14), // Submitted 14 hours ago
    stageEnteredDate: subHours(new Date(), 14),
    lastUpdatedDate: subHours(new Date(), 14),
    memberNotified: true,
    memberPartnerId: 'partner-001',
  },

  // ALERT TYPE 2: Qualified 3+ days without update
  {
    id: 'cand-001-qualified-alert',
    name: 'Sophia Turner',
    email: 'sophia.turner@example.com',
    roleId: 'role-001',
    source: 'ta_sourced',
    currentStage: 'qualified',
    submittedDate: subDays(new Date(), 10),
    stageEnteredDate: subDays(new Date(), 8),
    lastUpdatedDate: subDays(new Date(), 5), // 5 days without update
    memberNotified: true,
  },
  {
    id: 'cand-001-qualified-alert-2',
    name: 'James Anderson',
    email: 'james.anderson@example.com',
    roleId: 'role-001',
    source: 'member_referral',
    currentStage: 'qualified',
    submittedDate: subDays(new Date(), 8),
    stageEnteredDate: subDays(new Date(), 6),
    lastUpdatedDate: subDays(new Date(), 4), // 4 days without update
    memberNotified: true,
    referringMemberId: 'member-002',
  },

  // ALERT TYPE 3: Twill Interview 3+ days without update
  {
    id: 'cand-001-twill-alert',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    roleId: 'role-001',
    source: 'member_partner',
    currentStage: 'twill_interview',
    submittedDate: subDays(new Date(), 12),
    stageEnteredDate: subDays(new Date(), 8),
    lastUpdatedDate: subDays(new Date(), 6), // 6 days without update
    memberNotified: true,
    memberPartnerId: 'partner-002',
  },
  {
    id: 'cand-001-twill-alert-2',
    name: 'Noah Garcia',
    email: 'noah.garcia@example.com',
    roleId: 'role-001',
    source: 'ta_sourced',
    currentStage: 'twill_interview',
    submittedDate: subDays(new Date(), 10),
    stageEnteredDate: subDays(new Date(), 7),
    lastUpdatedDate: subDays(new Date(), 4), // 4 days without update
    memberNotified: true,
  },

  // ALERT TYPE 4: In Client Process 5+ business days
  {
    id: 'cand-001-client-process-alert',
    name: 'Ava Thompson',
    email: 'ava.thompson@example.com',
    roleId: 'role-001',
    source: 'member_referral',
    currentStage: 'in_client_process',
    submittedDate: subDays(new Date(), 20),
    stageEnteredDate: subDays(new Date(), 12),
    lastUpdatedDate: subDays(new Date(), 7), // 7 days without update
    memberNotified: true,
    referringMemberId: 'member-003',
  },
  {
    id: 'cand-001-client-process-alert-2',
    name: 'Ethan Brown',
    email: 'ethan.brown@example.com',
    roleId: 'role-001',
    source: 'member_partner',
    currentStage: 'in_client_process',
    submittedDate: subDays(new Date(), 18),
    stageEnteredDate: subDays(new Date(), 10),
    lastUpdatedDate: subDays(new Date(), 6), // 6 days without update
    memberNotified: true,
    memberPartnerId: 'partner-003',
  },

  // ALERT TYPE 5: Final Stages 3+ days
  {
    id: 'cand-001-final-stages-alert',
    name: 'Isabella Wilson',
    email: 'isabella.wilson@example.com',
    roleId: 'role-001',
    source: 'ta_sourced',
    currentStage: 'final_stages',
    submittedDate: subDays(new Date(), 25),
    stageEnteredDate: subDays(new Date(), 8),
    lastUpdatedDate: subDays(new Date(), 5), // 5 days without update
    memberNotified: true,
  },
  {
    id: 'cand-001-final-stages-alert-2',
    name: 'Mason Lee',
    email: 'mason.lee@example.com',
    roleId: 'role-001',
    source: 'member_referral',
    currentStage: 'final_stages',
    submittedDate: subDays(new Date(), 22),
    stageEnteredDate: subDays(new Date(), 7),
    lastUpdatedDate: subDays(new Date(), 4), // 4 days without update
    memberNotified: true,
    referringMemberId: 'member-004',
  },

  // Additional candidates in various non-alert stages for role-001
  createCandidate('cand-001-submitted', 'Charlotte Davis', 'charlotte.davis@example.com', 'role-001', 'member_partner', 'submitted', 10, 5, 1, 'partner-001'),
  createCandidate('cand-001-middle', 'Lucas Johnson', 'lucas.johnson@example.com', 'role-001', 'ta_sourced', 'middle_stages', 15, 8, 2),
  createCandidate('cand-001-verbal', 'Amelia Miller', 'amelia.miller@example.com', 'role-001', 'member_referral', 'verbal_offer', 30, 5, 1, undefined, 'member-005'),
  createCandidate('cand-001-signed', 'Oliver Moore', 'oliver.moore@example.com', 'role-001', 'ta_sourced', 'signed_offer', 35, 3, 1),
  createCandidate('cand-001-rejected', 'Mia Taylor', 'mia.taylor@example.com', 'role-001', 'member_partner', 'rejection_1', 12, 5, 3, 'partner-002'),
  createCandidate('cand-001-unqualified', 'Benjamin Clark', 'benjamin.clark@example.com', 'role-001', 'member_referral', 'unqualified', 8, 4, 2, undefined, 'member-006'),

  // ===============================================
  // Role 002 - Product Manager (DataFlow)
  // More candidates with some alerts
  // ===============================================

  // New submission
  {
    id: 'cand-002-new',
    name: 'Harper Rodriguez',
    email: 'harper.rodriguez@example.com',
    roleId: 'role-002',
    source: 'ta_sourced',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 6), // Submitted 6 hours ago
    stageEnteredDate: subHours(new Date(), 6),
    lastUpdatedDate: subHours(new Date(), 6),
    memberNotified: true,
  },

  // Qualified alert
  {
    id: 'cand-002-qualified-alert',
    name: 'Elijah Martinez',
    email: 'elijah.martinez@example.com',
    roleId: 'role-002',
    source: 'member_partner',
    currentStage: 'qualified',
    submittedDate: subDays(new Date(), 9),
    stageEnteredDate: subDays(new Date(), 7),
    lastUpdatedDate: subDays(new Date(), 5), // 5 days without update
    memberNotified: true,
    memberPartnerId: 'partner-004',
  },

  // Client process alert
  {
    id: 'cand-002-client-process',
    name: 'Abigail White',
    email: 'abigail.white@example.com',
    roleId: 'role-002',
    source: 'member_referral',
    currentStage: 'in_client_process',
    submittedDate: subDays(new Date(), 18),
    stageEnteredDate: subDays(new Date(), 11),
    lastUpdatedDate: subDays(new Date(), 8), // 8 days without update
    memberNotified: true,
    referringMemberId: 'member-007',
  },

  // Verbal offer (no alert)
  createCandidate('cand-002-verbal', 'Alexander Harris', 'alexander.harris@example.com', 'role-002', 'ta_sourced', 'verbal_offer', 28, 4, 1),

  // Signed offer (for booked revenue)
  createCandidate('cand-002-signed', 'Evelyn Thomas', 'evelyn.thomas@example.com', 'role-002', 'member_partner', 'signed_offer', 32, 2, 1, 'partner-005'),

  // ===============================================
  // Role 003 - Backend Engineer (CloudScale)
  // Fewer candidates, mixed stages
  // ===============================================

  createCandidate('cand-003-qualified', 'Daniel Jackson', 'daniel.jackson@example.com', 'role-003', 'member_referral', 'qualified', 5, 3, 1, undefined, 'member-008'),
  createCandidate('cand-003-twill', 'Scarlett Walker', 'scarlett.walker@example.com', 'role-003', 'ta_sourced', 'twill_interview', 7, 4, 2),
  createCandidate('cand-003-submitted', 'Henry Allen', 'henry.allen@example.com', 'role-003', 'member_partner', 'submitted', 10, 5, 1, 'partner-001'),
  createCandidate('cand-003-rejected', 'Grace Young', 'grace.young@example.com', 'role-003', 'member_referral', 'rejection_0', 12, 6, 4, undefined, 'member-001'),

  // ===============================================
  // Role 004 - Data Scientist (FinTech Innovations)
  // Multiple stages including signed offers
  // ===============================================

  // New submission
  {
    id: 'cand-004-new',
    name: 'Victoria King',
    email: 'victoria.king@example.com',
    roleId: 'role-004',
    source: 'member_referral',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 10),
    stageEnteredDate: subHours(new Date(), 10),
    lastUpdatedDate: subHours(new Date(), 10),
    memberNotified: true,
    referringMemberId: 'member-002',
  },

  // Final stages alert
  {
    id: 'cand-004-final-alert',
    name: 'Samuel Wright',
    email: 'samuel.wright@example.com',
    roleId: 'role-004',
    source: 'ta_sourced',
    currentStage: 'final_stages',
    submittedDate: subDays(new Date(), 20),
    stageEnteredDate: subDays(new Date(), 6),
    lastUpdatedDate: subDays(new Date(), 4), // 4 days without update
    memberNotified: true,
  },

  createCandidate('cand-004-client-process', 'Madison Scott', 'madison.scott@example.com', 'role-004', 'member_partner', 'in_client_process', 15, 8, 2, 'partner-002'),
  createCandidate('cand-004-middle', 'Jackson Green', 'jackson.green@example.com', 'role-004', 'member_referral', 'middle_stages', 18, 10, 3, undefined, 'member-003'),

  // Signed offers for booked revenue
  createCandidate('cand-004-signed-1', 'Chloe Adams', 'chloe.adams@example.com', 'role-004', 'ta_sourced', 'signed_offer', 35, 2, 1),
  createCandidate('cand-004-signed-2', 'Ryan Baker', 'ryan.baker@example.com', 'role-004', 'member_partner', 'signed_offer', 38, 3, 1, 'partner-003'),

  // ===============================================
  // Role 006 - DevOps Engineer (AI Dynamics)
  // Michael Chen's role
  // ===============================================

  createCandidate('cand-006-qualified', 'Ella Nelson', 'ella.nelson@example.com', 'role-006', 'member_referral', 'qualified', 4, 3, 1, undefined, 'member-004'),
  createCandidate('cand-006-twill', 'Sebastian Carter', 'sebastian.carter@example.com', 'role-006', 'ta_sourced', 'twill_interview', 8, 5, 2),
  createCandidate('cand-006-submitted', 'Aria Mitchell', 'aria.mitchell@example.com', 'role-006', 'member_partner', 'submitted', 10, 4, 1, 'partner-004'),
  createCandidate('cand-006-final', 'Logan Perez', 'logan.perez@example.com', 'role-006', 'member_referral', 'final_stages', 22, 7, 2, undefined, 'member-005'),
  createCandidate('cand-006-signed', 'Avery Roberts', 'avery.roberts@example.com', 'role-006', 'ta_sourced', 'signed_offer', 40, 4, 1),

  // ===============================================
  // Role 007 - Mobile Developer iOS (Mobile First)
  // Michael Chen's role
  // ===============================================

  {
    id: 'cand-007-new',
    name: 'Lily Turner',
    email: 'lily.turner@example.com',
    roleId: 'role-007',
    source: 'member_partner',
    currentStage: 'qualified',
    submittedDate: subHours(new Date(), 18),
    stageEnteredDate: subHours(new Date(), 18),
    lastUpdatedDate: subHours(new Date(), 18),
    memberNotified: true,
    memberPartnerId: 'partner-005',
  },

  createCandidate('cand-007-client-process', 'Carter Phillips', 'carter.phillips@example.com', 'role-007', 'ta_sourced', 'in_client_process', 16, 9, 2),
  createCandidate('cand-007-middle', 'Zoey Campbell', 'zoey.campbell@example.com', 'role-007', 'member_referral', 'middle_stages', 20, 12, 3, undefined, 'member-006'),
  createCandidate('cand-007-verbal', 'Luke Evans', 'luke.evans@example.com', 'role-007', 'member_partner', 'verbal_offer', 25, 5, 1, 'partner-001'),
  createCandidate('cand-007-signed', 'Penelope Parker', 'penelope.parker@example.com', 'role-007', 'ta_sourced', 'signed_offer', 42, 5, 1),

  // ===============================================
  // Role 011 - Full Stack Engineer (E-Commerce Plus)
  // Emily Rodriguez's role
  // ===============================================

  createCandidate('cand-011-qualified', 'Nora Edwards', 'nora.edwards@example.com', 'role-011', 'member_referral', 'qualified', 5, 4, 1, undefined, 'member-007'),
  createCandidate('cand-011-submitted', 'Grayson Collins', 'grayson.collins@example.com', 'role-011', 'ta_sourced', 'submitted', 9, 5, 2),
  createCandidate('cand-011-client-process', 'Hannah Stewart', 'hannah.stewart@example.com', 'role-011', 'member_partner', 'in_client_process', 14, 8, 3, 'partner-002'),
  createCandidate('cand-011-signed', 'Jack Morris', 'jack.morris@example.com', 'role-011', 'member_referral', 'signed_offer', 36, 3, 1, undefined, 'member-008'),

  // ===============================================
  // Role 016 - Frontend Developer React (E-Commerce Plus)
  // David Park's role
  // ===============================================

  createCandidate('cand-016-twill', 'Layla Rogers', 'layla.rogers@example.com', 'role-016', 'ta_sourced', 'twill_interview', 7, 5, 2),
  createCandidate('cand-016-submitted', 'Wyatt Reed', 'wyatt.reed@example.com', 'role-016', 'member_partner', 'submitted', 11, 6, 1, 'partner-003'),
  createCandidate('cand-016-final', 'Zoe Cook', 'zoe.cook@example.com', 'role-016', 'member_referral', 'final_stages', 19, 8, 2, undefined, 'member-001'),
  createCandidate('cand-016-verbal', 'Caleb Morgan', 'caleb.morgan@example.com', 'role-016', 'ta_sourced', 'verbal_offer', 24, 4, 1),
  createCandidate('cand-016-signed', 'Leah Bell', 'leah.bell@example.com', 'role-016', 'member_partner', 'signed_offer', 37, 4, 1, 'partner-004'),

  // ===============================================
  // Additional Signed Offers Across Various Roles
  // To demonstrate higher booked revenue in admin view
  // ===============================================

  // Role 008 - Engineering Manager (TechCorp) - Michael Chen
  createCandidate('cand-008-signed', 'Sophia Rodriguez', 'sophia.rodriguez@example.com', 'role-008', 'ta_sourced', 'signed_offer', 45, 5, 1),

  // Role 009 - Machine Learning Engineer (AI Dynamics) - Michael Chen
  createCandidate('cand-009-signed-1', 'Matthew Taylor', 'matthew.taylor@example.com', 'role-009', 'member_referral', 'signed_offer', 48, 6, 1, undefined, 'member-003'),
  createCandidate('cand-009-signed-2', 'Emily Brown', 'emily.brown@example.com', 'role-009', 'member_partner', 'signed_offer', 50, 4, 1, 'partner-001'),

  // Role 012 - QA Engineer (Enterprise Software) - Emily Rodriguez
  createCandidate('cand-012-signed', 'William Davis', 'william.davis@example.com', 'role-012', 'ta_sourced', 'signed_offer', 41, 3, 1),

  // Role 013 - Technical Product Manager (FinTech Innovations) - Emily Rodriguez
  createCandidate('cand-013-signed', 'Ava Wilson', 'ava.wilson@example.com', 'role-013', 'member_partner', 'signed_offer', 52, 5, 1, 'partner-002'),

  // Role 014 - Site Reliability Engineer (DataFlow) - Emily Rodriguez
  createCandidate('cand-014-signed', 'James Martinez', 'james.martinez@example.com', 'role-014', 'member_referral', 'signed_offer', 46, 4, 1, undefined, 'member-004'),

  // Role 017 - Data Engineer (DataFlow) - David Park
  createCandidate('cand-017-signed', 'Isabella Johnson', 'isabella.johnson@example.com', 'role-017', 'ta_sourced', 'signed_offer', 43, 5, 1),

  // Role 019 - Backend Engineer Node.js (Mobile First) - David Park
  createCandidate('cand-019-signed-1', 'Ethan Garcia', 'ethan.garcia@example.com', 'role-019', 'member_partner', 'signed_offer', 44, 4, 1, 'partner-005'),
  createCandidate('cand-019-signed-2', 'Charlotte Lee', 'charlotte.lee@example.com', 'role-019', 'member_referral', 'signed_offer', 47, 6, 1, undefined, 'member-006'),

  // Role 020 - Product Designer (FinTech Innovations) - David Park
  createCandidate('cand-020-signed', 'Lucas Martinez', 'lucas.martinez@example.com', 'role-020', 'ta_sourced', 'signed_offer', 49, 5, 1),
];
