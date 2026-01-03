import { AdminRepository } from '../repositories/AdminRepository';
import { PendingUser } from '../entities/PendingUser';

export const getPendingUsersUseCase = (repository: AdminRepository) => async (): Promise<PendingUser[]> => {
  return await repository.getPendingUsers();
};

