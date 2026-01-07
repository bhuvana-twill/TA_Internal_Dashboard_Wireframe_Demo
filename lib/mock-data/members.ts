import { Member } from '@/types';
import { subMonths, subDays } from 'date-fns';

export const mockMembers: Member[] = [
  // Partners
  {
    id: 'partner-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    type: 'partner',
    company: 'Tech Ventures Inc',
    joinedDate: subMonths(new Date(), 18),
  },
  {
    id: 'partner-002',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@example.com',
    type: 'partner',
    company: 'Innovation Partners',
    joinedDate: subMonths(new Date(), 24),
  },
  {
    id: 'partner-003',
    name: 'Emily Watson',
    email: 'emily.watson@example.com',
    type: 'partner',
    company: 'Growth Advisors',
    joinedDate: subMonths(new Date(), 12),
  },
  {
    id: 'partner-004',
    name: 'David Kim',
    email: 'david.kim@example.com',
    type: 'partner',
    company: 'Startup Accelerator',
    joinedDate: subMonths(new Date(), 15),
  },
  {
    id: 'partner-005',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@example.com',
    type: 'partner',
    company: 'Executive Network',
    joinedDate: subMonths(new Date(), 20),
  },

  // Regular Members
  {
    id: 'member-001',
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 8),
  },
  {
    id: 'member-002',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 6),
  },
  {
    id: 'member-003',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 10),
  },
  {
    id: 'member-004',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 4),
  },
  {
    id: 'member-005',
    name: 'Robert Lee',
    email: 'robert.lee@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 14),
  },
  {
    id: 'member-006',
    name: 'Amanda Foster',
    email: 'amanda.foster@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 5),
  },
  {
    id: 'member-007',
    name: 'Chris Johnson',
    email: 'chris.johnson@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 9),
  },
  {
    id: 'member-008',
    name: 'Nina Patel',
    email: 'nina.patel@example.com',
    type: 'member',
    joinedDate: subMonths(new Date(), 7),
  },
];
