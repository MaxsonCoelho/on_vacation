import { AdminRepository } from '../../domain/repositories/AdminRepository';
import { AdminReports } from '../../domain/entities/AdminReports';
import { PendingUser } from '../../domain/entities/PendingUser';
import { User } from '../../domain/entities/User';
import * as Local from '../datasources/local/AdminLocalDataSource';
import * as Remote from '../datasources/remote/AdminRemoteDataSource';
import { SyncQueue } from '../../../../core/offline/queue/SyncQueue';
import { getDatabase } from '../../../../core/offline/database/connection';

export const AdminRepositoryImpl: AdminRepository = {
  getReports: async (): Promise<AdminReports> => {
    console.log('[AdminRepository] Getting reports...');
    
    // Sempre calcula do banco local primeiro (fonte mais confiável devido a RLS)
    const reportsFromLocal = await getReportsFromLocalDatabase();
    console.log('[AdminRepository] Local database reports:', reportsFromLocal.totalRequests, 'requests');
    
    // Tenta buscar perfis do remoto para estatísticas de usuários
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
      
      // Salva localmente para cache
      try {
        await Local.saveReportsLocal(combinedReports);
      } catch (saveError) {
        console.warn('[AdminRepository] Error saving reports to local DB:', saveError);
      }
      
      return combinedReports;
    } catch (error) {
      console.warn('[AdminRepository] Error fetching remote reports, using local data only:', error);
      
      // Se falhar ao buscar perfis remotos, usa apenas dados locais de solicitações
      // e valores padrão para perfis
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
    console.log('[AdminRepository] Getting pending users...');
    
    try {
      const remoteUsers = await Remote.getPendingUsersRemote();
      
      // Salva localmente para cache
      try {
        await Local.savePendingUsersLocal(remoteUsers);
      } catch (saveError) {
        console.warn('[AdminRepository] Error saving pending users to local DB:', saveError);
      }
      
      return remoteUsers;
    } catch (error) {
      console.warn('[AdminRepository] Error fetching remote pending users, using local cache:', error);
      
      // Se falhar, retorna cache local
      return await Local.getPendingUsersLocal();
    }
  },

  getUsers: async (filter?: string): Promise<User[]> => {
    console.log('[AdminRepository] Getting users...');
    
    try {
      const remoteUsers = await Remote.getUsersRemote(filter);
      
      // Salva localmente para cache
      try {
        await Local.saveUsersLocal(remoteUsers);
      } catch (saveError) {
        console.warn('[AdminRepository] Error saving users to local DB:', saveError);
      }
      
      return remoteUsers;
    } catch (error) {
      console.warn('[AdminRepository] Error fetching remote users, using local cache:', error);
      
      // Se falhar, retorna cache local
      return await Local.getUsersLocal(filter);
    }
  },

  approveUser: async (userId: string): Promise<void> => {
    console.log('[AdminRepository] Approving user:', userId);
    
    // Atualiza localmente primeiro (optimistic UI)
    // Não temos tabela local para atualizar diretamente, então apenas enfileira
    
    // Enfileira para sincronização
    await SyncQueue.enqueue('APPROVE_USER', { userId });
    
    // Tenta executar imediatamente se online
    try {
      await Remote.approveUserRemote(userId);
    } catch (error) {
      console.warn('[AdminRepository] Error approving user remotely, queued for sync:', error);
      // Já está na fila, vai tentar novamente depois
    }
  },

  rejectUser: async (userId: string): Promise<void> => {
    console.log('[AdminRepository] Rejecting user:', userId);
    
    // Enfileira para sincronização
    await SyncQueue.enqueue('REJECT_USER', { userId });
    
    // Tenta executar imediatamente se online
    try {
      await Remote.rejectUserRemote(userId);
    } catch (error) {
      console.warn('[AdminRepository] Error rejecting user remotely, queued for sync:', error);
      // Já está na fila, vai tentar novamente depois
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive'): Promise<void> => {
    console.log('[AdminRepository] Updating user status:', userId, status);
    
    // Enfileira para sincronização
    await SyncQueue.enqueue('UPDATE_USER_STATUS', { userId, status });
    
    // Tenta executar imediatamente se online
    try {
      await Remote.updateUserStatusRemote(userId, status);
    } catch (error) {
      console.warn('[AdminRepository] Error updating user status remotely, queued for sync:', error);
      // Já está na fila, vai tentar novamente depois
    }
  },
};

// Função auxiliar para calcular relatórios a partir do banco local de solicitações
const getReportsFromLocalDatabase = async (): Promise<AdminReports> => {
  try {
    const db = await getDatabase();
    
    // Buscar todas as solicitações do banco local
    const requests = await db.getAllAsync<{
      status: string;
      created_at: string;
    }>('SELECT status, created_at FROM vacation_requests ORDER BY created_at DESC', []);
    
    console.log('[AdminRepository] Local requests found:', requests.length);
    
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

