import { VacationRequest } from '../entities/VacationRequest';

export interface VacationRepository {
  getRequests(userId: string): Promise<VacationRequest[]>;
  createRequest(request: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'>): Promise<void>;
}
