export interface Manager {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'manager';
  department: string;
  position?: string;
  phone?: string;
}
