export interface Member {
  id: string;
  name: string;
  email: string;
  type: 'member' | 'partner';
  company?: string;
  joinedDate: Date;
}