import { AdminRepository } from '../repositories/AdminRepository';

export const rejectRequestUseCase = (repository: AdminRepository) => (
  requestId: string,
  notes?: string
): Promise<void> => {
  return repository.rejectRequest(requestId, notes);
};

