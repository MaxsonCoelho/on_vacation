import { ManagerRepository } from '../../domain/repositories/ManagerRepository';
import { Manager } from '../../domain/entities/Manager';
import { TeamRequest } from '../../domain/entities/TeamRequest';
import * as Local from '../datasources/local/ManagerLocalDataSource';
import * as Remote from '../datasources/remote/ManagerRemoteDataSource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { SyncWorker } from '../../../../core/offline/queue/SyncWorker';
import { useAuthStore } from '../../../auth/presentation/store/useAuthStore';
import { supabase } from '../../../../core/services/supabase';
import NetInfo from '@react-native-community/netinfo';

// Função auxiliar para atualizar os nomes dos profiles nas solicitações locais
const updateLocalRequestNames = async (requests: TeamRequest[]): Promise<void> => {
  try {
    // Buscar user_ids únicos que precisam de atualização (aqueles com "Unknown")
    const userIdsToUpdate = [...new Set(
      requests
        .filter(r => !r.employeeName || r.employeeName === 'Unknown')
        .map(r => r.employeeId)
    )];

    if (userIdsToUpdate.length === 0) return;

    // Buscar profiles do Supabase
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIdsToUpdate);

    if (!profilesData || profilesData.length === 0) {
      return;
    }

    // Criar map de profiles
    const profilesMap = new Map(profilesData.map(p => [p.id, p]));

    // Atualizar solicitações locais com os nomes corretos
    const requestsToUpdate = requests
      .filter(r => !r.employeeName || r.employeeName === 'Unknown')
      .map(r => {
        const profile = profilesMap.get(r.employeeId);
        if (profile) {
          return {
            ...r,
            employeeName: profile.name,
            employeeAvatarUrl: profile.avatar_url
          };
        }
        return r;
      });

    // Salvar as solicitações atualizadas
    if (requestsToUpdate.length > 0) {
      await Local.saveRequestsLocal(requestsToUpdate);
    }
  } catch (error) {
    console.warn('[ManagerRepository] Error updating local request names:', error);
  }
};

export const ManagerRepositoryImpl: ManagerRepository = {
  getProfile: async (): Promise<Manager> => {
    const localProfile = await Local.getProfileLocal();
    if (localProfile) return localProfile;

    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('User not logged in');
    
    return await Remote.getProfileRemote(userId);
  },

  getTeamRequests: async (
    filter?: string, 
    limit: number = 10, 
    offset: number = 0
  ): Promise<{ data: TeamRequest[]; hasMore: boolean; total?: number }> => {
    // Buscar do local primeiro (pode ter dados em cache)
    const localResult = await Local.getTeamRequestsLocal(limit, offset, filter);
    let requests = localResult.data;
    let hasMore = localResult.total ? offset + limit < localResult.total : false;
    let total = localResult.total;
    
    // Sempre tenta buscar do remoto para atualizar os dados (apenas primeira página para cache)
    if (offset === 0) {
      try {
        const remoteResult = await Remote.getTeamRequestsRemote(limit, offset, filter);
        
        if (remoteResult.data.length > 0) {
          // Se encontrou dados remotos, salva localmente (cache completo)
          try {
            await Local.saveRequestsLocal(remoteResult.data);
            // Re-fetch from local to get the merged state (remote + preserved local changes)
            const refreshedLocal = await Local.getTeamRequestsLocal(limit, offset, filter);
            requests = refreshedLocal.data;
            total = remoteResult.total || refreshedLocal.total;
            hasMore = total ? offset + limit < total : false;
          } catch (saveError) {
            // Usa dados remotos em memória mesmo se não conseguir salvar
            requests = remoteResult.data;
            total = remoteResult.total;
            hasMore = total ? offset + limit < total : false;
          }
        } else if (requests.length > 0) {
          // Se não encontrou dados remotos mas tem dados locais, atualiza os nomes dos profiles
          await updateLocalRequestNames(requests);
          const refreshedLocal = await Local.getTeamRequestsLocal(limit, offset, filter);
          requests = refreshedLocal.data;
        }
      } catch (e) {
        // Se falhou e tem dados locais, tenta atualizar os nomes dos profiles
        if (requests.length > 0) {
          await updateLocalRequestNames(requests);
          const refreshedLocal = await Local.getTeamRequestsLocal(limit, offset, filter);
          requests = refreshedLocal.data;
          hasMore = refreshedLocal.total ? offset + limit < refreshedLocal.total : false;
          total = refreshedLocal.total;
        }
      }
    }
    
    // Ensure sorting by date descending (newest first)
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Se não temos total e temos dados, calcula hasMore baseado no tamanho retornado
    if (total === undefined) {
      // Se retornou exatamente o limit, provavelmente há mais
      hasMore = requests.length === limit;
    }
    
    return { data: requests, hasMore, total };
  },

  approveRequest: async (requestId: string, notes?: string): Promise<void> => {
    // 1. Sempre atualiza local primeiro (optimistic UI)
    await Local.updateRequestStatusLocal(requestId, 'approved', notes);
    
    // 2. Verifica se tem internet e sessão ativa (com timeout para não bloquear offline)
    const networkCheck = Promise.race([
      NetInfo.fetch(),
      new Promise(resolve => setTimeout(() => resolve({ isConnected: false }), 500)) // 500ms timeout
    ]) as Promise<{ isConnected: boolean }>;
    
    const sessionCheck = Promise.race([
      supabase.auth.getSession().then(({ data }) => data.session),
      new Promise(resolve => setTimeout(() => resolve(null), 500)) // 500ms timeout
    ]) as Promise<any>;
    
    const [netState, session] = await Promise.all([networkCheck, sessionCheck]);
    
    if (netState?.isConnected && session) {
      // 3. Se tiver internet, atualiza remoto imediatamente (em background, não bloqueia)
      Remote.approveRequestRemote(requestId, notes)
        .then(() => {
          // Dispara processamento de fila para garantir que qualquer item pendente seja processado
          SyncWorker.processQueue().catch(() => {
            // Silent fail - will retry later
          });
        })
        .catch(() => {
          // Se falhar no remoto, enfileira para retry (em background)
          SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes }).catch(() => {
            // Silent fail
          });
        });
    } else {
      // 4. Se não tiver internet, apenas enfileira (em background)
      SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes }).catch(() => {
        // Silent fail
      });
    }
  },

  rejectRequest: async (requestId: string, notes?: string): Promise<void> => {
    // 1. Sempre atualiza local primeiro (optimistic UI)
    await Local.updateRequestStatusLocal(requestId, 'rejected', notes);
    
    // 2. Verifica se tem internet e sessão ativa (com timeout para não bloquear offline)
    const networkCheck = Promise.race([
      NetInfo.fetch(),
      new Promise(resolve => setTimeout(() => resolve({ isConnected: false }), 500)) // 500ms timeout
    ]) as Promise<{ isConnected: boolean }>;
    
    const sessionCheck = Promise.race([
      supabase.auth.getSession().then(({ data }) => data.session),
      new Promise(resolve => setTimeout(() => resolve(null), 500)) // 500ms timeout
    ]) as Promise<any>;
    
    const [netState, session] = await Promise.all([networkCheck, sessionCheck]);
    
    if (netState?.isConnected && session) {
      // 3. Se tiver internet, atualiza remoto imediatamente (em background, não bloqueia)
      Remote.rejectRequestRemote(requestId, notes)
        .then(() => {
          // Dispara processamento de fila para garantir que qualquer item pendente seja processado
          SyncWorker.processQueue().catch(() => {
            // Silent fail - will retry later
          });
        })
        .catch(() => {
          // Se falhar no remoto, enfileira para retry (em background)
          SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes }).catch(() => {
            // Silent fail
          });
        });
    } else {
      // 4. Se não tiver internet, apenas enfileira (em background)
      SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes }).catch(() => {
        // Silent fail
      });
    }
  }
};
