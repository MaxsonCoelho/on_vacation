import { ManagerRepository } from '../repositories/ManagerRepository';

export const approveRequestUseCase = (repository: ManagerRepository) => (requestId: string, notes?: string): Promise<void> => {
  return repository.approveRequest(requestId, notes);
};
