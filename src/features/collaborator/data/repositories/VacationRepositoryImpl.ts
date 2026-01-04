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
        const remoteRequests = await getRequestsRemote(userId);
        await Promise.all(remoteRequests.map(req => saveRequestLocal(req)));
    } catch (error) {
    }

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

    await saveRequestLocal(newRequest);

    let netState: { isConnected: boolean } | null = null;
    let session: any = null;
    
    try {
      const networkPromise = NetInfo.fetch();
      const sessionPromise = supabase.auth.getSession().then(({ data }) => data.session);
      
      const [networkResult, sessionResult] = await Promise.allSettled([
        Promise.race([networkPromise, new Promise(resolve => setTimeout(() => resolve({ isConnected: false }), 2000))]),
        Promise.race([sessionPromise, new Promise(resolve => setTimeout(() => resolve(null), 2000))])
      ]);
      
      netState = networkResult.status === 'fulfilled' ? networkResult.value as { isConnected: boolean } : { isConnected: false };
      session = sessionResult.status === 'fulfilled' ? sessionResult.value : null;
    } catch {
      netState = { isConnected: false };
      session = null;
    }
    
    if (netState?.isConnected && session) {
      try {
        await createRequestRemote(newRequest);
        
        try {
          const remoteRequests = await getRequestsRemote(request.userId);
          const createdRequest = remoteRequests.find(r => r.id === newRequest.id);
          if (createdRequest) {
            await saveRequestLocal(createdRequest);
          }
        } catch (syncError) {
        }
        
        SyncWorker.processQueue().catch(() => {});
      } catch (error) {
        await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
        SyncWorker.processQueue().catch(() => {});
      }
    } else {
      await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
    }
  }
};
