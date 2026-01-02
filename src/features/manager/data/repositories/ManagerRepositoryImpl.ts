import { ManagerRepository } from '../../domain/repositories/ManagerRepository';
import { Manager } from '../../domain/entities/Manager';
import { TeamRequest } from '../../domain/entities/TeamRequest';
import * as Local from '../datasources/local/ManagerLocalDataSource';
import * as Remote from '../datasources/remote/ManagerRemoteDataSource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { useAuthStore } from '../../../auth/presentation/store/useAuthStore';

export const ManagerRepositoryImpl: ManagerRepository = {
  getProfile: async (): Promise<Manager> => {
    const localProfile = await Local.getProfileLocal();
    if (localProfile) return localProfile;

    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('User not logged in');
    
    return await Remote.getProfileRemote(userId);
  },

  getTeamRequests: async (filter?: string): Promise<TeamRequest[]> => {
    console.log('[ManagerRepository] Getting team requests...');
    let requests = await Local.getTeamRequestsLocal();
    console.log('[ManagerRepository] Local requests count:', requests.length);
    
    // Always fetch remote for now to ensure we have data during development/testing
    // Or if local is empty
    if (requests.length === 0) {
        console.log('[ManagerRepository] Local is empty, fetching remote...');
        try {
            const remoteRequests = await Remote.getTeamRequestsRemote();
            
            // Update in-memory requests immediately so UI shows data even if save fails
            requests = remoteRequests;
            
            try {
                await Local.saveRequestsLocal(remoteRequests);
            } catch (saveError) {
                console.warn('[ManagerRepository] Error saving to local DB (possible schema mismatch?):', saveError);
            }
        } catch (e) {
            console.warn('[ManagerRepository] Error fetching remote requests', e);
        }
    } else {
        // Optional: Background sync could go here
        // For debugging: let's try to fetch remote anyway and update local if successful
        try {
             // console.log('[ManagerRepository] Fetching remote to update local...');
             const remoteRequests = await Remote.getTeamRequestsRemote();
             
             try {
                await Local.saveRequestsLocal(remoteRequests);
                // Re-fetch from local to get the merged state (remote + preserved local changes)
                requests = await Local.getTeamRequestsLocal();
             } catch (saveError) {
                console.warn('[ManagerRepository] Error saving to local DB (background sync):', saveError);
             }
        } catch (e) {
            console.warn('[ManagerRepository] Error background syncing remote requests', e);
        }
    }
    
    // Ensure sorting by date descending (newest first)
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (filter && filter !== 'Todas') {
        const normalizedFilter = filter === 'Pendentes' ? 'pending' 
                               : filter === 'Aprovadas' ? 'approved'
                               : filter === 'Reprovadas' ? 'rejected'
                               : filter.toLowerCase();
                               
        return requests.filter(r => r.status === normalizedFilter);
    }
    
    return requests;
  },

  approveRequest: async (requestId: string, notes?: string): Promise<void> => {
    await Local.updateRequestStatusLocal(requestId, 'approved', notes);
    await SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes });
  },

  rejectRequest: async (requestId: string, notes?: string): Promise<void> => {
    await Local.updateRequestStatusLocal(requestId, 'rejected', notes);
    await SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes });
  }
};
