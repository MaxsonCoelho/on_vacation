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
        const remoteRequests = await getRequestsRemote(userId);
        
        // 2. Update local cache with remote data
        // We use Promise.all for parallel insertion which is faster
        await Promise.all(remoteRequests.map(req => saveRequestLocal(req)));
    } catch (error) {
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

    // 2. Verifica se tem internet e sessão ativa
    // Tenta verificar rede e sessão, mas não bloqueia por muito tempo
    let netState: { isConnected: boolean } | null = null;
    let session: any = null;
    
    try {
      const networkPromise = NetInfo.fetch();
      const sessionPromise = supabase.auth.getSession().then(({ data }) => data.session);
      
      // Aguarda até 2 segundos para verificação de rede/sessão
      const [networkResult, sessionResult] = await Promise.allSettled([
        Promise.race([networkPromise, new Promise(resolve => setTimeout(() => resolve({ isConnected: false }), 2000))]),
        Promise.race([sessionPromise, new Promise(resolve => setTimeout(() => resolve(null), 2000))])
      ]);
      
      netState = networkResult.status === 'fulfilled' ? networkResult.value as { isConnected: boolean } : { isConnected: false };
      session = sessionResult.status === 'fulfilled' ? sessionResult.value : null;
    } catch {
      // Se falhar a verificação, assume offline
      netState = { isConnected: false };
      session = null;
    }
    
    // Se tiver internet e sessão, SEMPRE tenta criar no remoto imediatamente
    if (netState?.isConnected && session) {
      try {
        // Tenta criar no remoto (await para garantir que foi criado)
        await createRequestRemote(newRequest);
        
        // Após criar no remoto com sucesso, atualiza o local com os dados do remoto
        // Isso garante que o local tenha os mesmos dados que o remoto (timestamps, etc)
        try {
          const remoteRequests = await getRequestsRemote(request.userId);
          const createdRequest = remoteRequests.find(r => r.id === newRequest.id);
          if (createdRequest) {
            await saveRequestLocal(createdRequest);
          }
        } catch (syncError) {
          // Não é crítico se falhar a sincronização, o remoto já foi atualizado
        }
        
        // Dispara processamento de fila para garantir que qualquer item pendente seja processado
        SyncWorker.processQueue().catch(() => {
          // Silent fail - will retry later
        });
      } catch (error) {
        // Se falhar no remoto mesmo estando online, enfileira para retry
        await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
        
        // Dispara processamento de fila para tentar novamente imediatamente
        SyncWorker.processQueue().catch(() => {
          // Silent fail - will retry later
        });
        
        // Não lança erro aqui - funcionou localmente, apenas precisa sincronizar
      }
    } else {
      // Se não tiver internet ou sessão, apenas enfileira
      await SyncQueue.enqueue('CREATE_VACATION_REQUEST', newRequest);
    }
  }
};
