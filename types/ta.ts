export type UserRole = 'ta' | 'admin';

export interface TalentAdvisor {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedRoleIds: string[]; // References to Role.id
}
