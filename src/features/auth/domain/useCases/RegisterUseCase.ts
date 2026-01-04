import { AuthRepository } from '../types/AuthRepository';

export const registerUseCase = (authRepository: AuthRepository) => 
  async (
    email: string,
    password: string,
    name: string,
    role: 'Colaborador' | 'Gestor' | 'Administrador',
    department?: string,
    position?: string,
    phone?: string
  ): Promise<void> => {
    return await authRepository.register(email, password, name, role, department, position, phone);
  };

