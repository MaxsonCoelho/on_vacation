import { VacationRepository } from '../../domain/types/VacationRepository';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { getRequestsRemote } from '../datasources/remote/VacationRemoteDatasource';
import { saveRequestLocal, getRequestsLocal } from '../datasources/local/VacationLocalDatasource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { generateUUID } from '../../../../core/utils';

export const VacationRepositoryImpl: VacationRepository = {
  getRequests: async (userId: string): Promise<VacationRequest[]> => {
    // Strategy: Read local first (Source of Truth), then sync
    // For now, let's keep it simple: read local.
    // Ideally, we should have a way to trigger background sync here.
    const localRequests = await getRequestsLocal(userId);
    
    if (localRequests.length === 0) {
        // Fallback or initial sync
        try {
            const remoteRequests = await getRequestsRemote(userId);
            // Save remote to local
            for (const req of remoteRequests) {
                await saveRequestLocal(req);
            }
            return remoteRequests;
        } catch (error) {
            console.warn('[VacationRepository] Error fetching remote requests:', error);
            return [];
        }
    }

    return localRequests;
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
