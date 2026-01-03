import { AdminRepository } from '../repositories/AdminRepository';

export const rejectUserUseCase = (repository: AdminRepository) => async (userId: string): Promise<void> => {
  return await repository.rejectUser(userId);
};

