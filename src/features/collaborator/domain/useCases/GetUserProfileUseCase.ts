import { ProfileRepository } from '../types/ProfileRepository';
import { UserProfile } from '../entities/UserProfile';

export const getUserProfileUseCase = (repository: ProfileRepository) => (userId: string): Promise<UserProfile> => {
  return repository.getProfile(userId);
};
