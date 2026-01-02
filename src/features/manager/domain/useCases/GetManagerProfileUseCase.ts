import { Manager } from '../entities/Manager';
import { ManagerRepository } from '../repositories/ManagerRepository';

export const getManagerProfileUseCase = (repository: ManagerRepository) => (): Promise<Manager> => {
  return repository.getProfile();
};
