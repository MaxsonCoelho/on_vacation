import { UserProfile } from '../entities/UserProfile';

export interface ProfileRepository {
  getProfile(userId: string): Promise<UserProfile>;
}
