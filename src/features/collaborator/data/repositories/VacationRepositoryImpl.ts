import { VacationRepository } from '../../domain/types/VacationRepository';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { getRequestsRemote, createRequestRemote } from '../datasources/remote/VacationRemoteDatasource';
import { saveRequestLocal, getRequestsLocal } from '../datasources/local/VacationLocalDatasource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { SyncWorker } from '../../../../core/offline/queue/SyncWorker';
import { generateUUID } from '../../../../core/utils';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../../../core/services/supabase';

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

    // 1. Sempre salva local primeiro (optimistic UI)
    await saveRequestLocal(newRequest);
    console.log('[VacationRepository] Local save completed for request:', newRequest.id);

    // 2. Verifica se tem internet e sessão ativa
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // 3. Se tiver internet, envia para remoto imediatamente
      try {
        console.log('[VacationRepository] Online - sending to remote immediately. Request:', newRequest.id);
        await createRequestRemote(newRequest);
        console.log('[VacationRepository] Remote create successful. Request:', newRequest.id);
        
        // Dispara processamento de fila para garantir que qualquer item pendente seja processado
        SyncWorker.processQueue().catch(err => {
          console.warn('[VacationRepository] Error processing queue after create:', err);
        });
      } catch (error) {
        // Se falhar no remoto, enfileira para retry
        console.error('[VacationRepository] Remote create failed, queuing for retry:', error);
        await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
        console.log('[VacationRepository] Request queued for sync:', newRequest.id);
      }
    } else {
      // 4. Se não tiver internet, apenas enfileira
      console.log('[VacationRepository] Offline - queuing for sync. Request:', newRequest.id);
      await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
      console.log('[VacationRepository] Request queued for sync:', newRequest.id);
    }
  }
};
