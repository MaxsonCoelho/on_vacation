import { User } from '../entities/User';

export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
  register(
    email: string,
    password: string,
    name: string,
    role: 'Colaborador' | 'Gestor' | 'Administrador',
    department?: string,
    position?: string,
    phone?: string
  ): Promise<void>;
  logout(): Promise<void>;
  checkAuthStatus(): Promise<User | null>;
}
