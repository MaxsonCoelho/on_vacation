import { create } from 'zustand';
import { User } from '../../domain/entities/User';
import { authRepository } from '../../data/repositories/AuthRepositoryImpl';
import { loginUseCase } from '../../useCases/LoginUseCase';
import { logoutUseCase } from '../../useCases/LogoutUseCase';
import { checkAuthStatusUseCase } from '../../useCases/CheckAuthStatusUseCase';

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
      set({ user, isLoading: false });
      return user;
    } catch (error) {
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
    // Avoid setting loading to true if just checking initialization to prevent flash
    // But since we want to block app load, maybe it's fine.
    // Let's set it to true.
    set({ isLoading: true });
    try {
      const user = await checkAuthStatus();
      set({ user, isLoading: false, isInitialized: true });
    } catch (error) {
      console.log('Check auth error:', error);
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },
}));
