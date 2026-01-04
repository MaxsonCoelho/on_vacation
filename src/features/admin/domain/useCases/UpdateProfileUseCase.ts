import { AdminRepository } from '../repositories/AdminRepository';

export const updateProfileUseCase = (repository: AdminRepository) => 
  async (
    userId: string,
    role: 'Colaborador' | 'Gestor' | 'Administrador',
    department?: string,
    position?: string,
    phone?: string
  ): Promise<void> => {
    return await repository.updateProfile(userId, role, department, position, phone);
  };

