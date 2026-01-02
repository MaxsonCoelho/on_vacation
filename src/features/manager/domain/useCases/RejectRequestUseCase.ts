import { ManagerRepository } from '../repositories/ManagerRepository';

export const rejectRequestUseCase = (repository: ManagerRepository) => (requestId: string, notes?: string): Promise<void> => {
  return repository.rejectRequest(requestId, notes);
};
