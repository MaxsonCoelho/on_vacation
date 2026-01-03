import { AdminRepository } from '../repositories/AdminRepository';
import { AdminReports } from '../entities/AdminReports';

export const getAdminReportsUseCase = (repository: AdminRepository) => async (): Promise<AdminReports> => {
  return await repository.getReports();
};

