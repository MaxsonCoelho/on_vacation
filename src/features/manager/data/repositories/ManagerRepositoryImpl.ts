import { ManagerRepository } from '../../domain/repositories/ManagerRepository';
import { Manager } from '../../domain/entities/Manager';
import { TeamRequest } from '../../domain/entities/TeamRequest';
import * as Local from '../datasources/local/ManagerLocalDataSource';
import * as Remote from '../datasources/remote/ManagerRemoteDataSource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { useAuthStore } from '../../../auth/presentation/store/useAuthStore';
import { supabase } from '../../../../core/services/supabase';

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

    console.log('[ManagerRepository] Updating names for user_ids:', userIdsToUpdate);

    // Buscar profiles do Supabase
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIdsToUpdate);

    if (!profilesData || profilesData.length === 0) {
      console.warn('[ManagerRepository] No profiles found for user_ids');
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
      console.log('[ManagerRepository] Updated', requestsToUpdate.length, 'requests with profile names');
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

  getTeamRequests: async (filter?: string): Promise<TeamRequest[]> => {
    console.log('[ManagerRepository] Getting team requests...');
    let requests = await Local.getTeamRequestsLocal();
    console.log('[ManagerRepository] Local requests count:', requests.length);
    
    // Sempre tenta buscar do remoto para atualizar os dados
    try {
        const remoteRequests = await Remote.getTeamRequestsRemote();
        
        if (remoteRequests.length > 0) {
            // Se encontrou dados remotos, salva localmente
            try {
                await Local.saveRequestsLocal(remoteRequests);
                // Re-fetch from local to get the merged state (remote + preserved local changes)
                requests = await Local.getTeamRequestsLocal();
            } catch (saveError) {
                console.warn('[ManagerRepository] Error saving to local DB:', saveError);
                // Usa dados remotos em memória mesmo se não conseguir salvar
                requests = remoteRequests;
            }
        } else if (requests.length > 0) {
            // Se não encontrou dados remotos mas tem dados locais, atualiza os nomes dos profiles
            // Buscar profiles para os user_ids das solicitações locais
            await updateLocalRequestNames(requests);
            requests = await Local.getTeamRequestsLocal();
        }
    } catch (e) {
        console.warn('[ManagerRepository] Error fetching remote requests', e);
        // Se falhou e tem dados locais, tenta atualizar os nomes dos profiles
        if (requests.length > 0) {
            await updateLocalRequestNames(requests);
            requests = await Local.getTeamRequestsLocal();
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
