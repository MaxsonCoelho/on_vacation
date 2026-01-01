import { VacationRepository } from '../types/VacationRepository';
import { VacationRequest } from '../entities/VacationRequest';

export const createVacationRequestUseCase = (repository: VacationRepository) => {
  return async (request: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'>) => {
    return await repository.createRequest(request);
  };
};
