import { Manager } from '../entities/Manager';
import { TeamRequest } from '../entities/TeamRequest';

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  total?: number;
}

export interface ManagerRepository {
  getProfile(): Promise<Manager>;
  getTeamRequests(filter?: string, limit?: number, offset?: number): Promise<PaginatedResult<TeamRequest>>;
  approveRequest(requestId: string, notes?: string): Promise<void>;
  rejectRequest(requestId: string, notes?: string): Promise<void>;
}
