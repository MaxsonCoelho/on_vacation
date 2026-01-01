import { User } from '../entities/User';

export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  checkAuthStatus(): Promise<User | null>;
}
