import { TeamRequest } from '../../../manager/domain/entities/TeamRequest';
import { AdminRepository } from '../repositories/AdminRepository';

export const getUserRequestsUseCase = (repository: AdminRepository) => (
  userId: string,
  filter?: string
): Promise<TeamRequest[]> => {
  return repository.getUserRequests(userId, filter);
};

