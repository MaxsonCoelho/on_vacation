import { AdminRepository } from '../repositories/AdminRepository';

export const updateUserStatusUseCase = (repository: AdminRepository) => async (
  userId: string, 
  status: 'active' | 'inactive'
): Promise<void> => {
  return await repository.updateUserStatus(userId, status);
};

