import { AdminRepository } from '../../domain/repositories/AdminRepository';
import { AdminReports } from '../../domain/entities/AdminReports';
import { PendingUser } from '../../domain/entities/PendingUser';
import { User } from '../../domain/entities/User';
import * as Local from '../datasources/local/AdminLocalDataSource';
import * as Remote from '../datasources/remote/AdminRemoteDataSource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { SyncWorker } from '../../../../core/offline/queue/SyncWorker';
import { QueueRepository } from '../../../../core/offline/queue/QueueRepository';
import { getDatabase } from '../../../../core/offline/database/connection';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../../../core/services/supabase';

export const AdminRepositoryImpl: AdminRepository = {
  getReports: async (): Promise<AdminReports> => {
    // 1. Verifica se tem internet e sessão ativa para sincronizar
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    // 1.5. PRIMEIRO: Processa a fila de sincronização para enviar mudanças locais ao remoto
    // Isso garante que aprovações/rejeições offline sejam sincronizadas ANTES de buscar dados
    if (netState.isConnected && session) {
      const pendingQueueItems = await QueueRepository.getPending();
      if (pendingQueueItems.length > 0) {
        try {
          await SyncWorker.processQueue();
        } catch (error) {
          // Silent fail - will continue with fetch
        }
      }
    }
    
    // 2. Se tem internet, SEMPRE tenta sincronizar solicitações do remoto
    if (netState.isConnected && session) {
      try {
        const remoteRequests = await Remote.getRequestsRemoteForSync();
        
        if (remoteRequests && remoteRequests.length > 0) {
          // Buscar profiles para os user_ids das solicitações
          const userIds = [...new Set(remoteRequests.map(r => r.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .in('id', userIds);
          
          const profilesMap = new Map(profilesData?.map(p => [p.id, { name: p.name, avatar_url: p.avatar_url }]) || []);
          
          // Adicionar requester_name e requester_avatar às solicitações
          const requestsWithProfiles = remoteRequests.map(req => ({
            ...req,
            requester_name: profilesMap.get(req.user_id)?.name || null,
            requester_avatar: profilesMap.get(req.user_id)?.avatar_url || null,
          }));
          
          // Sincronizar para o banco local (isso atualiza/insere todas as solicitações)
          await Local.syncRequestsFromRemote(requestsWithProfiles);
        }
      } catch (error) {
        // Continua com dados locais mesmo se sync falhar
      }
    }
    
    // 3. Calcula do banco local (agora tem dados sincronizados do remoto se houver internet)
    const reportsFromLocal = await getReportsFromLocalDatabase();
    
    // 3. Tenta buscar perfis do remoto para estatísticas de usuários
    if (netState.isConnected && session) {
      try {
        const remoteReports = await Remote.getReportsRemote();
        
        // Combina: solicitações do local (mais atualizado), perfis do remoto
        const combinedReports: AdminReports = {
          totalRequests: reportsFromLocal.totalRequests,
          approvedRequests: reportsFromLocal.approvedRequests,
          pendingRequests: reportsFromLocal.pendingRequests,
          rejectedRequests: reportsFromLocal.rejectedRequests,
          newRequestsThisMonth: reportsFromLocal.newRequestsThisMonth,
          approvedRequestsThisMonth: reportsFromLocal.approvedRequestsThisMonth,
          totalCollaborators: remoteReports.totalCollaborators,
          totalManagers: remoteReports.totalManagers,
          activeCollaborators: remoteReports.activeCollaborators,
          pendingRegistrations: remoteReports.pendingRegistrations,
          newRegistrationsThisMonth: remoteReports.newRegistrationsThisMonth,
        };
        
        // Salva localmente para cache (importante para funcionar offline)
        try {
          await Local.saveReportsLocal(combinedReports);
        } catch (saveError) {
          // Silent fail - reports will be saved next time
        }
        
        return combinedReports;
      } catch (error) {
        // Se falhar, tenta buscar do banco local (pode ter dados salvos de antes)
        const localReports = await Local.getReportsLocal();
        if (localReports) {
          // Usa dados salvos localmente, mas mantém solicitações do local atualizado
          return {
            ...localReports,
            totalRequests: reportsFromLocal.totalRequests,
            approvedRequests: reportsFromLocal.approvedRequests,
            pendingRequests: reportsFromLocal.pendingRequests,
            rejectedRequests: reportsFromLocal.rejectedRequests,
            newRequestsThisMonth: reportsFromLocal.newRequestsThisMonth,
            approvedRequestsThisMonth: reportsFromLocal.approvedRequestsThisMonth,
          };
        }
        
        // Se não tem dados locais salvos, usa valores padrão
        return {
          ...reportsFromLocal,
          totalCollaborators: 0,
          totalManagers: 0,
          activeCollaborators: 0,
          pendingRegistrations: 0,
          newRegistrationsThisMonth: 0,
        };
      }
    } else {
      // Offline: busca do banco local
      const localReports = await Local.getReportsLocal();
      if (localReports) {
        // Usa dados salvos localmente, mas mantém solicitações do local atualizado
        return {
          ...localReports,
          totalRequests: reportsFromLocal.totalRequests,
          approvedRequests: reportsFromLocal.approvedRequests,
          pendingRequests: reportsFromLocal.pendingRequests,
          rejectedRequests: reportsFromLocal.rejectedRequests,
          newRequestsThisMonth: reportsFromLocal.newRequestsThisMonth,
          approvedRequestsThisMonth: reportsFromLocal.approvedRequestsThisMonth,
        };
      }
      
      // Se não tem dados locais, retorna apenas solicitações
      return {
        ...reportsFromLocal,
        totalCollaborators: 0,
        totalManagers: 0,
        activeCollaborators: 0,
        pendingRegistrations: 0,
        newRegistrationsThisMonth: 0,
      };
    }
  },

  getPendingUsers: async (): Promise<PendingUser[]> => {
    // Verifica se tem internet e sessão antes de tentar buscar do remoto
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // PRIMEIRO: Processa a fila de sincronização para enviar mudanças locais ao remoto
      // Isso garante que aprovações/rejeições offline sejam sincronizadas ANTES de buscar dados
      const pendingQueueItems = await QueueRepository.getPending();
      if (pendingQueueItems.length > 0) {
        try {
          await SyncWorker.processQueue();
        } catch (error) {
          // Silent fail - will continue with fetch
        }
      }
      
      try {
        const remoteUsers = await Remote.getPendingUsersRemote();
        
        // Salva localmente para cache
        try {
          await Local.savePendingUsersLocal(remoteUsers);
        } catch (saveError) {
          // Silent fail - data will be fetched again next time
        }
        
        return remoteUsers;
      } catch (error) {
        // Se falhar, retorna cache local
        return await Local.getPendingUsersLocal();
      }
    } else {
      // Se não tiver internet, retorna diretamente do local
      return await Local.getPendingUsersLocal();
    }
  },

  getUsers: async (filter?: string): Promise<User[]> => {
    // Verifica se tem internet e sessão antes de tentar buscar do remoto
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // PRIMEIRO: Processa a fila de sincronização para enviar mudanças locais ao remoto
      // Isso garante que aprovações/rejeições offline sejam sincronizadas ANTES de buscar dados
      const pendingQueueItems = await QueueRepository.getPending();
      if (pendingQueueItems.length > 0) {
        try {
          await SyncWorker.processQueue();
        } catch (error) {
          // Silent fail - will continue with fetch
        }
      }
      
      try {
        const remoteUsers = await Remote.getUsersRemote(filter);
        
        // Salva localmente para cache
        try {
          await Local.saveUsersLocal(remoteUsers);
        } catch (saveError) {
          // Silent fail - data will be fetched again next time
        }
        
        return remoteUsers;
      } catch (error) {
        // Se falhar, retorna cache local
        return await Local.getUsersLocal(filter);
      }
    } else {
      // Se não tiver internet, retorna diretamente do local
      return await Local.getUsersLocal(filter);
    }
  },

  approveUser: async (userId: string): Promise<void> => {
    // 1. SEMPRE atualiza local primeiro (optimistic update)
    const approvedUser = await Local.approveUserLocal(userId);
    if (!approvedUser) {
      // Verifica se o usuário já foi aprovado anteriormente (pode ter sido em outra sessão)
      const localUsers = await Local.getUsersLocal();
      const userExists = localUsers.find(u => u.id === userId && u.status === 'active');
      
      if (userExists) {
        // Usuário já está aprovado - não é um erro, apenas retorna
        return;
      }
      
      // Se realmente não existe, lança erro
      throw new Error(`Pending user not found: ${userId}`);
    }
    
    // 1.5. Recalcula reports a partir dos dados locais (importante para funcionar offline)
    try {
      await Local.recalculateReportsFromLocal();
    } catch (recalcError) {
      // Silent fail - reports will be recalculated next time
    }
    
    // 2. Verifica se tem internet e sessão ativa
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // Se tiver internet, atualiza remoto imediatamente
      try {
        await Remote.approveUserRemote(userId);
        
        // Dispara processamento de fila para garantir que qualquer item pendente seja processado
        SyncWorker.processQueue().catch(() => {
          // Silent fail - will retry later
        });
      } catch (error) {
        // Se falhar no remoto, enfileira para retry
        await SyncQueue.enqueue('APPROVE_USER', { userId });
        // NÃO lança erro aqui - funcionou localmente, apenas enfileira para sync
      }
    } else {
      // Se não tiver internet, apenas enfileira
      await SyncQueue.enqueue('APPROVE_USER', { userId });
      // NÃO lança erro aqui - funcionou localmente, apenas enfileira para sync
    }
  },

  rejectUser: async (userId: string): Promise<void> => {
    // 1. SEMPRE atualiza local primeiro (optimistic update)
    try {
      await Local.rejectUserLocal(userId);
    } catch (error) {
      // Se não encontrou o usuário pendente, pode já ter sido rejeitado
      // Verifica se ainda existe na lista de pendentes
      const pendingUsers = await Local.getPendingUsersLocal();
      const userStillPending = pendingUsers.find(u => u.id === userId);
      
      if (!userStillPending) {
        // Usuário já foi rejeitado - não é um erro, apenas retorna
        return;
      }
      
      // Se ainda está pendente mas deu erro ao rejeitar, lança erro
      throw error;
    }
    
    // 1.5. Recalcula reports a partir dos dados locais (importante para funcionar offline)
    try {
      await Local.recalculateReportsFromLocal();
    } catch (recalcError) {
      // Silent fail - reports will be recalculated next time
    }
    
    // 2. Verifica se tem internet e sessão ativa
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // Se tiver internet, atualiza remoto imediatamente
      try {
        await Remote.rejectUserRemote(userId);
        
        // Dispara processamento de fila para garantir que qualquer item pendente seja processado
        SyncWorker.processQueue().catch(() => {
          // Silent fail - will retry later
        });
      } catch (error) {
        // Se falhar no remoto, enfileira para retry
        await SyncQueue.enqueue('REJECT_USER', { userId });
      }
    } else {
      // Se não tiver internet, apenas enfileira
      await SyncQueue.enqueue('REJECT_USER', { userId });
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive'): Promise<void> => {
    // 1. SEMPRE atualiza local primeiro (optimistic update)
    await Local.updateUserStatusLocal(userId, status);
    
    // 1.5. Recalcula reports a partir dos dados locais (importante para funcionar offline)
    try {
      await Local.recalculateReportsFromLocal();
    } catch (recalcError) {
      // Silent fail - reports will be recalculated next time
    }
    
    // 2. Verifica se tem internet e sessão ativa
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // Se tiver internet, atualiza remoto imediatamente
      try {
        await Remote.updateUserStatusRemote(userId, status);
        
        // Dispara processamento de fila para garantir que qualquer item pendente seja processado
        SyncWorker.processQueue().catch(() => {
          // Silent fail - will retry later
        });
      } catch (error) {
        // Se falhar no remoto, enfileira para retry
        await SyncQueue.enqueue('UPDATE_USER_STATUS', { userId, status });
      }
    } else {
      // Se não tiver internet, apenas enfileira
      await SyncQueue.enqueue('UPDATE_USER_STATUS', { userId, status });
    }
  },
};

// Função auxiliar para calcular relatórios a partir do banco local de solicitações
const getReportsFromLocalDatabase = async (): Promise<AdminReports> => {
  try {
    const db = await getDatabase();
    
    // Buscar todas as solicitações do banco local (sem filtro de user_id)
    const requests = await db.getAllAsync<{
      id: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>('SELECT id, status, created_at, updated_at FROM vacation_requests ORDER BY created_at DESC', []);
    
    // Calcular estatísticas
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const totalRequests = requests.length;
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    
    // Solicitações deste mês
    const requestsThisMonth = requests.filter(r => {
      const requestDate = new Date(r.created_at);
      return requestDate >= monthStart;
    });
    const newRequestsThisMonth = requestsThisMonth.length;
    const approvedRequestsThisMonth = requestsThisMonth.filter(r => r.status === 'approved').length;
    
    // Para perfis, ainda precisa buscar do remoto ou cache
    // Por enquanto, retorna 0 para perfis e apenas solicitações do local
    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      rejectedRequests,
      totalCollaborators: 0, // Será atualizado pelo remoto
      totalManagers: 0, // Será atualizado pelo remoto
      activeCollaborators: 0, // Será atualizado pelo remoto
      pendingRegistrations: 0, // Será atualizado pelo remoto
      newRequestsThisMonth,
      approvedRequestsThisMonth,
      newRegistrationsThisMonth: 0, // Será atualizado pelo remoto
    };
  } catch (error) {
    console.error('[AdminRepository] Error getting reports from local database:', error);
    if (error instanceof Error) {
      console.error('[AdminRepository] Error message:', error.message);
      console.error('[AdminRepository] Error stack:', error.stack);
    }
    return {
      totalRequests: 0,
      approvedRequests: 0,
      pendingRequests: 0,
      rejectedRequests: 0,
      totalCollaborators: 0,
      totalManagers: 0,
      activeCollaborators: 0,
      pendingRegistrations: 0,
      newRequestsThisMonth: 0,
      approvedRequestsThisMonth: 0,
      newRegistrationsThisMonth: 0,
    };
  }
};

