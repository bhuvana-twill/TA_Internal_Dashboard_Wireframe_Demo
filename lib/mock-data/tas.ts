import { TalentAdvisor } from '@/types';

export const mockTAs: TalentAdvisor[] = [
  {
    id: 'ta-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@twill.com',
    role: 'ta',
    assignedRoleIds: ['role-001', 'role-002', 'role-003', 'role-004', 'role-005'],
  },
  {
    id: 'ta-002',
    name: 'Michael Chen',
    email: 'michael.chen@twill.com',
    role: 'ta',
    assignedRoleIds: ['role-006', 'role-007', 'role-008', 'role-009', 'role-010'],
  },
  {
    id: 'ta-003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@twill.com',
    role: 'ta',
    assignedRoleIds: ['role-011', 'role-012', 'role-013', 'role-014', 'role-015'],
  },
  {
    id: 'ta-004',
    name: 'David Park',
    email: 'david.park@twill.com',
    role: 'ta',
    assignedRoleIds: ['role-016', 'role-017', 'role-018', 'role-019', 'role-020'],
  },
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@twill.com',
    role: 'admin',
    assignedRoleIds: [], // Admins see all roles
  },
];
