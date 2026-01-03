import { AdminRepository } from '../repositories/AdminRepository';

export const approveUserUseCase = (repository: AdminRepository) => async (userId: string): Promise<void> => {
  return await repository.approveUser(userId);
};

