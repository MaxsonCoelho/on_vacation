import { create } from 'zustand';
import { UserProfile } from '../../domain/entities/UserProfile';
import { getUserProfileUseCase } from '../../domain/useCases/GetUserProfileUseCase';
import { ProfileRepositoryImpl } from '../../data/repositories/ProfileRepositoryImpl';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const getProfile = getUserProfileUseCase(ProfileRepositoryImpl);
      const profile = await getProfile(userId);
      set({ profile, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar perfil';
      set({ error: message, isLoading: false });
    }
  },
  clearProfile: () => set({ profile: null, error: null }),
}));
