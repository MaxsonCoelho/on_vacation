import { VacationRepository } from '../../domain/types/VacationRepository';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { getRequestsRemote } from '../datasources/remote/VacationRemoteDatasource';
import { saveRequestLocal, getRequestsLocal } from '../datasources/local/VacationLocalDatasource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { generateUUID } from '../../../../core/utils';

export const VacationRepositoryImpl: VacationRepository = {
  getRequests: async (userId: string): Promise<VacationRequest[]> => {
    try {
        // 1. Try to fetch fresh data from remote
        console.log('[VacationRepository] Fetching remote requests...');
        const remoteRequests = await getRequestsRemote(userId);
        
        // 2. Update local cache with remote data
        // We use Promise.all for parallel insertion which is faster
        await Promise.all(remoteRequests.map(req => saveRequestLocal(req)));
        
        console.log(`[VacationRepository] Synced ${remoteRequests.length} requests from remote.`);
    } catch (error) {
        console.warn('[VacationRepository] Error fetching remote requests (offline mode):', error);
        // Continue to return local data even if remote fails
    }

    // 3. Return local data (Single Source of Truth)
    // This includes the freshly synced remote items + any pending local items that haven't synced yet
    return await getRequestsLocal(userId);
  },

  createRequest: async (request: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'>): Promise<void> => {
    const newRequest: VacationRequest = {
      ...request,
      id: generateUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      managerNotes: undefined
    };

    // 1. Save Local (Optimistic UI)
    await saveRequestLocal(newRequest);

    // 2. Enqueue Sync Action
    await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
  }
};
