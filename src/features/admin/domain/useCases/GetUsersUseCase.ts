import { AdminRepository } from '../repositories/AdminRepository';
import { User } from '../entities/User';

export const getUsersUseCase = (repository: AdminRepository) => async (filter?: string): Promise<User[]> => {
  return await repository.getUsers(filter);
};

