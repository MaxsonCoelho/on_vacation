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
    // Aguarda um pouco para garantir que a sessão esteja disponível
    let session = null;
    let attempts = 0;
    while (!session && attempts < 3) {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      session = currentSession;
      if (!session && attempts < 2) {
        console.log(`[SyncWorker] Session not ready yet, waiting... (attempt ${attempts + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 300)); // Aguarda 300ms
      }
      attempts++;
    }
    
    if (!session) {
        console.log('[SyncWorker] No active session after retries. Skipping sync.');
        return;
    }
    
    console.log('[SyncWorker] Session confirmed. Processing queue...');

    const pendingItems = await QueueRepository.getPending();
    
    if (pendingItems.length === 0) {
        console.log('[SyncWorker] No pending items to process.');
        return;
    }

    console.log(`[SyncWorker] Processing ${pendingItems.length} items...`);
    let processedCount = 0;

    for (const item of pendingItems) {
      // Não precisa verificar conexão/sessão aqui novamente - já verificamos antes do loop
      // Isso evita race conditions onde a sessão pode não estar disponível no momento exato
      
      try {
        console.log(`[SyncWorker] Processing item: ${item.type} (${item.id})`);
        
        switch (item.type) {
          case 'APPROVE_REQUEST': {
            const payload = item.payload as { requestId: string; notes?: string };
            console.log(`[SyncWorker] Approving request ${payload.requestId} on remote...`);
            await approveRequestRemote(payload.requestId, payload.notes);
            console.log(`[SyncWorker] Request ${payload.requestId} approved successfully on remote`);
            break;
          }
            
          case 'REJECT_REQUEST': {
            const payload = item.payload as { requestId: string; notes?: string };
            console.log(`[SyncWorker] Rejecting request ${payload.requestId} on remote...`);
            await rejectRequestRemote(payload.requestId, payload.notes);
            console.log(`[SyncWorker] Request ${payload.requestId} rejected successfully on remote`);
            break;
          }
            
          case 'CREATE_VACATION_REQUEST': {
            // Payload is the VacationRequest object
            const request = item.payload as Partial<VacationRequest>;
            console.log(`[SyncWorker] Creating request ${request.id} on remote...`);
            await createRequestRemote(request);
            console.log(`[SyncWorker] Request ${request.id} created successfully on remote`);
            break;
          }
            
          case 'APPROVE_USER': {
            const payload = item.payload as { userId: string };
            console.log(`[SyncWorker] Approving user ${payload.userId} on remote...`);
            await approveUserRemote(payload.userId);
            console.log(`[SyncWorker] User ${payload.userId} approved successfully on remote`);
            break;
          }
            
          case 'REJECT_USER': {
            const payload = item.payload as { userId: string };
            console.log(`[SyncWorker] Rejecting user ${payload.userId} on remote...`);
            await rejectUserRemote(payload.userId);
            console.log(`[SyncWorker] User ${payload.userId} rejected successfully on remote`);
            break;
          }
            
          case 'UPDATE_USER_STATUS': {
            const payload = item.payload as { userId: string; status: 'active' | 'inactive' };
            console.log(`[SyncWorker] Updating user ${payload.userId} status to ${payload.status} on remote...`);
            await updateUserStatusRemote(payload.userId, payload.status);
            console.log(`[SyncWorker] User ${payload.userId} status updated successfully on remote`);
            break;
          }
            
          default:
            console.warn(`[SyncWorker] Unknown item type: ${item.type}`);
        }

        // Mark as completed/removed
        await QueueRepository.remove(item.id);
        processedCount++;
        console.log(`[SyncWorker] Item ${item.id} processed successfully.`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        // Log do erro para debug
        console.error(`[SyncWorker] Error processing item ${item.id} (type: ${item.type}):`, errorMessage);
        if (errorStack) {
          console.error(`[SyncWorker] Error stack:`, errorStack);
        }
        
        // Verifica se o erro é devido a falta de conexão ou sessão (não é um erro crítico)
        const currentNetState = await NetInfo.fetch();
        const { data: { currentSession } } = await supabase.auth.getSession();
        
        if (!currentNetState.isConnected) {
          // Se perdeu conexão durante o processamento, mantém como pending
          console.log(`[SyncWorker] Connection lost while processing item ${item.id}. Will retry when online.`);
          continue; // Pula para o próximo item
        }
        
        if (!currentSession) {
          // Se perdeu sessão durante o processamento, mantém como pending
          console.log(`[SyncWorker] Session lost while processing item ${item.id}. Will retry when session is available.`);
          continue; // Pula para o próximo item
        }
        
        // Se tem conexão e sessão mas ainda assim falhou, é um erro real - incrementa retry
        await QueueRepository.incrementRetry(item.id);
        const updatedItem = await QueueRepository.get(item.id);
        const newRetryCount = (updatedItem?.retryCount || item.retryCount) + 1;
        
        // If retries > MAX_RETRIES, mark as failed
        if (newRetryCount >= 5) {
            console.error(`[SyncWorker] Item ${item.id} exceeded max retries (5). Marking as failed.`);
            await QueueRepository.updateStatus(item.id, 'failed');
        } else {
            console.log(`[SyncWorker] Item ${item.id} will be retried. Retry count: ${newRetryCount}/5`);
            // Mantém como 'pending' para ser processado novamente
        }
      }
    }
    
    console.log(`[SyncWorker] Completed processing. ${processedCount} items processed successfully.`);
    
    // Se processou itens com sucesso, verifica se há mais itens na fila
    // (pode ter sido adicionados durante o processamento)
    const remainingItems = await QueueRepository.getPending();
    if (remainingItems.length > 0 && processedCount > 0) {
        console.log(`[SyncWorker] Found ${remainingItems.length} more items. Processing again...`);
        // Recursivamente processa itens restantes (com limite de profundidade)
        // Para evitar loops infinitos, apenas processa uma vez adicional
        setTimeout(() => {
            SyncWorker.processQueue().catch(err => {
                console.warn('[SyncWorker] Error in recursive queue processing:', err);
            });
        }, 500); // Pequeno delay para evitar processamento excessivo
    }
  }
};
