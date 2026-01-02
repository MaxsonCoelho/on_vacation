import { Manager } from '../entities/Manager';
import { TeamRequest } from '../entities/TeamRequest';

export interface ManagerRepository {
  getProfile(): Promise<Manager>;
  getTeamRequests(filter?: string): Promise<TeamRequest[]>;
  approveRequest(requestId: string, notes?: string): Promise<void>;
  rejectRequest(requestId: string, notes?: string): Promise<void>;
}
