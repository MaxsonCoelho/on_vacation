import { QueueRepository } from './QueueRepository';
import { approveRequestRemote, rejectRequestRemote } from '../../../features/manager/data/datasources/remote/ManagerRemoteDataSource';
import { createRequestRemote } from '../../../features/collaborator/data/datasources/remote/VacationRemoteDatasource';
import { approveUserRemote, rejectUserRemote, updateUserStatusRemote } from '../../../features/admin/data/datasources/remote/AdminRemoteDataSource';
import { VacationRequest } from '../../../features/collaborator/domain/entities/VacationRequest';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../services/supabase';

export const SyncWorker = {
  processQueue: async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
        console.log('[SyncWorker] Offline. Skipping sync.');
        return;
    }

    // Check for valid session before processing to avoid RLS errors
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        console.log('[SyncWorker] No active session. Skipping sync.');
        return;
    }

    const pendingItems = await QueueRepository.getPending();
    
    if (pendingItems.length === 0) return;

    console.log(`[SyncWorker] Processing ${pendingItems.length} items...`);

    for (const item of pendingItems) {
      try {
        console.log(`[SyncWorker] Processing item: ${item.type} (${item.id})`);
        
        switch (item.type) {
          case 'APPROVE_REQUEST': {
            const payload = item.payload as { requestId: string; notes?: string };
            await approveRequestRemote(payload.requestId, payload.notes);
            break;
          }
            
          case 'REJECT_REQUEST': {
            const payload = item.payload as { requestId: string; notes?: string };
            await rejectRequestRemote(payload.requestId, payload.notes);
            break;
          }
            
          case 'CREATE_VACATION_REQUEST':
            // Payload is the VacationRequest object
            await createRequestRemote(item.payload as Partial<VacationRequest>);
            break;
            
          case 'APPROVE_USER': {
            const payload = item.payload as { userId: string };
            await approveUserRemote(payload.userId);
            break;
          }
            
          case 'REJECT_USER': {
            const payload = item.payload as { userId: string };
            await rejectUserRemote(payload.userId);
            break;
          }
            
          case 'UPDATE_USER_STATUS': {
            const payload = item.payload as { userId: string; status: 'active' | 'inactive' };
            await updateUserStatusRemote(payload.userId, payload.status);
            break;
          }
            
          default:
            console.warn(`[SyncWorker] Unknown item type: ${item.type}`);
        }

        // Mark as completed/removed
        await QueueRepository.remove(item.id);
        console.log(`[SyncWorker] Item ${item.id} processed successfully.`);
        
      } catch (error) {
        console.error(`[SyncWorker] Error processing item ${item.id}:`, error);
        await QueueRepository.incrementRetry(item.id);
        
        // If retries > MAX_RETRIES, mark as failed (logic in repository or here)
        if (item.retryCount >= 5) { // Increased to 5 for better resilience
            await QueueRepository.updateStatus(item.id, 'failed');
        }
      }
    }
  }
};
