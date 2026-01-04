import { AdminReports } from '../entities/AdminReports';
import { PendingUser } from '../entities/PendingUser';
import { User } from '../entities/User';
import { TeamRequest } from '../../manager/domain/entities/TeamRequest';

export interface AdminRepository {
  getReports: () => Promise<AdminReports>;
  getPendingUsers: () => Promise<PendingUser[]>;
  getUsers: (filter?: string) => Promise<User[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => Promise<void>;
  updateProfile: (
    userId: string,
    role: 'Colaborador' | 'Gestor' | 'Administrador',
    department?: string,
    position?: string,
    phone?: string
  ) => Promise<void>;
  getUserRequests: (userId: string, filter?: string) => Promise<TeamRequest[]>;
  approveRequest: (requestId: string, notes?: string) => Promise<void>;
  rejectRequest: (requestId: string, notes?: string) => Promise<void>;
}

