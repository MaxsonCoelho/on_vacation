import { create } from 'zustand';
import { User } from '../../domain/entities/User';
import { authRepository } from '../../data/repositories/AuthRepositoryImpl';
import { loginUseCase } from '../../domain/useCases/LoginUseCase';
import { logoutUseCase } from '../../domain/useCases/LogoutUseCase';
import { checkAuthStatusUseCase } from '../../domain/useCases/CheckAuthStatusUseCase';

// Instantiate use cases with the repository implementation
const login = loginUseCase(authRepository);
const logout = logoutUseCase(authRepository);
const checkAuthStatus = checkAuthStatusUseCase(authRepository);

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await login(email, password);
      console.log('[AuthStore] signIn - User logged in:', { id: user.id, email: user.email, role: user.role, status: user.status });
      set({ user, isLoading: false, isInitialized: true });
      return user;
    } catch (error) {
      console.log('[AuthStore] signIn - Error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state to ensure UI updates
      set({ user: null, isLoading: false });
    }
  },

  checkAuth: async () => {
    console.log('[AuthStore] checkAuth - Starting check...');
    set({ isLoading: true });
    try {
      const user = await checkAuthStatus();
      console.log('[AuthStore] checkAuth - Result:', user ? { id: user.id, email: user.email, role: user.role, status: user.status } : null);
      set({ user, isLoading: false, isInitialized: true });
    } catch (error) {
      console.log('[AuthStore] checkAuth - Error:', error);
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },
}));
