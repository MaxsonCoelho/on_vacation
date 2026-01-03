import { AdminReports } from '../entities/AdminReports';
import { PendingUser } from '../entities/PendingUser';
import { User } from '../entities/User';

export interface AdminRepository {
  getReports: () => Promise<AdminReports>;
  getPendingUsers: () => Promise<PendingUser[]>;
  getUsers: (filter?: string) => Promise<User[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => Promise<void>;
}

