import { VacationRepository } from '../types/VacationRepository';
import { VacationRequest } from '../entities/VacationRequest';

export const getVacationRequestsUseCase = (repository: VacationRepository) => (userId: string): Promise<VacationRequest[]> => {
  return repository.getRequests(userId);
};
