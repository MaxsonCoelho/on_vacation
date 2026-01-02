import { TeamRequest } from '../entities/TeamRequest';
import { ManagerRepository } from '../repositories/ManagerRepository';

export const getTeamRequestsUseCase = (repository: ManagerRepository) => (filter?: string): Promise<TeamRequest[]> => {
  return repository.getTeamRequests(filter);
};
