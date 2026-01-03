export interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending';
  createdAt: string;
  department?: string;
  position?: string;
  phone?: string;
}

