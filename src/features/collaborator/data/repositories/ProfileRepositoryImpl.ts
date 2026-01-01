import { ProfileRepository } from '../../domain/types/ProfileRepository';
import { UserProfile } from '../../domain/entities/UserProfile';
import { getProfileRemote } from '../datasources/remote/ProfileRemoteDatasource';

export const ProfileRepositoryImpl: ProfileRepository = {
  getProfile: async (userId: string): Promise<UserProfile> => {
    return await getProfileRemote(userId);
  }
};
