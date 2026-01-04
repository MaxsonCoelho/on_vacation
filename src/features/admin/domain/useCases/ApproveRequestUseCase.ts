import { AdminRepository } from '../repositories/AdminRepository';

export const approveRequestUseCase = (repository: AdminRepository) => (
  requestId: string,
  notes?: string
): Promise<void> => {
  return repository.approveRequest(requestId, notes);
};

