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
        await new Promise(resolve => setTimeout(resolve, 300)); // Aguarda 300ms
      }
      attempts++;
    }
    
    if (!session) {
        return;
    }

    const pendingItems = await QueueRepository.getPending();
    
    if (pendingItems.length === 0) {
        return;
    }
    let processedCount = 0;

    for (const item of pendingItems) {
      // Não precisa verificar conexão/sessão aqui novamente - já verificamos antes do loop
      // Isso evita race conditions onde a sessão pode não estar disponível no momento exato
      
      try {
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
            
          case 'CREATE_VACATION_REQUEST': {
            // Payload is the VacationRequest object
            const request = item.payload as Partial<VacationRequest>;
            try {
              await createRequestRemote(request);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              // Se for erro de duplicata, trata como sucesso (idempotência)
              if (errorMessage.includes('duplicate key') || errorMessage.includes('23505')) {
                // Solicitação já existe, considera como sucesso
                break;
              }
              // Outros erros são propagados
              throw error;
            }
            break;
          }
            
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
        }

        // Mark as completed/removed
        await QueueRepository.remove(item.id);
        processedCount++;
        
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
          continue; // Pula para o próximo item
        }
        
        if (!currentSession) {
          // Se perdeu sessão durante o processamento, mantém como pending
          continue; // Pula para o próximo item
        }
        
        // Se tem conexão e sessão mas ainda assim falhou, é um erro real - incrementa retry
        await QueueRepository.incrementRetry(item.id);
        const updatedItem = await QueueRepository.get(item.id);
        const newRetryCount = (updatedItem?.retryCount || item.retryCount) + 1;
        
        // If retries > MAX_RETRIES, mark as failed
        if (newRetryCount >= 5) {
            await QueueRepository.updateStatus(item.id, 'failed');
        }
        // Mantém como 'pending' para ser processado novamente
      }
    }
    
    // Se processou itens com sucesso, verifica se há mais itens na fila
    // (pode ter sido adicionados durante o processamento)
    const remainingItems = await QueueRepository.getPending();
    if (remainingItems.length > 0 && processedCount > 0) {
        // Recursivamente processa itens restantes (com limite de profundidade)
        // Para evitar loops infinitos, apenas processa uma vez adicional
        setTimeout(() => {
            SyncWorker.processQueue().catch(() => {
                // Silent fail - will retry later
            });
        }, 500); // Pequeno delay para evitar processamento excessivo
    }
  }
};
