import { TeamRequest } from '../entities/TeamRequest';
import { ManagerRepository, PaginatedResult } from '../repositories/ManagerRepository';

export const getTeamRequestsUseCase = (repository: ManagerRepository) => (
  filter?: string, 
  limit?: number, 
  offset?: number
): Promise<PaginatedResult<TeamRequest>> => {
  return repository.getTeamRequests(filter, limit, offset);
};
