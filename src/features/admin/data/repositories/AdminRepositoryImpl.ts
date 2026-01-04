import { AdminRepository } from '../../domain/repositories/AdminRepository';
import { AdminReports } from '../../domain/entities/AdminReports';
import { PendingUser } from '../../domain/entities/PendingUser';
import { User } from '../../domain/entities/User';
import { TeamRequest } from '../../../manager/domain/entities/TeamRequest';
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
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Processa fila de sincronização ANTES de buscar dados para garantir que mudanças offline sejam enviadas
    if (netState.isConnected && session) {
      const pendingQueueItems = await QueueRepository.getPending();
      if (pendingQueueItems.length > 0) {
        try {
          await SyncWorker.processQueue();
        } catch (error) {
        }
      }
    }
    
    if (netState.isConnected && session) {
      try {
        const remoteRequests = await Remote.getRequestsRemoteForSync();
        
        if (remoteRequests && remoteRequests.length > 0) {
          const userIds = [...new Set(remoteRequests.map(r => r.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .in('id', userIds);
          
          const profilesMap = new Map(profilesData?.map(p => [p.id, { name: p.name, avatar_url: p.avatar_url }]) || []);
          
          const requestsWithProfiles = remoteRequests.map(req => ({
            ...req,
            requester_name: profilesMap.get(req.user_id)?.name || null,
            requester_avatar: profilesMap.get(req.user_id)?.avatar_url || null,
          }));
          
          await Local.syncRequestsFromRemote(requestsWithProfiles);
        }
      } catch (error) {
      }
    }
    
    const reportsFromLocal = await getReportsFromLocalDatabase();
    
    if (netState.isConnected && session) {
      try {
        const remoteReports = await Remote.getReportsRemote();
        
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
        
        try {
          await Local.saveReportsLocal(combinedReports);
        } catch (saveError) {
        }
        
        return combinedReports;
      } catch (error) {
        const localReports = await Local.getReportsLocal();
        if (localReports) {
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
      const localReports = await Local.getReportsLocal();
      if (localReports) {
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
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      const pendingQueueItems = await QueueRepository.getPending();
      if (pendingQueueItems.length > 0) {
        try {
          await SyncWorker.processQueue();
        } catch (error) {
        }
      }
      
      try {
        const remoteUsers = await Remote.getPendingUsersRemote();
        
        try {
          await Local.savePendingUsersLocal(remoteUsers);
        } catch (saveError) {
        }
        
        return remoteUsers;
      } catch (error) {
        return await Local.getPendingUsersLocal();
      }
    } else {
      return await Local.getPendingUsersLocal();
    }
  },

  getUsers: async (filter?: string): Promise<User[]> => {
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      const pendingQueueItems = await QueueRepository.getPending();
      if (pendingQueueItems.length > 0) {
        try {
          await SyncWorker.processQueue();
        } catch (error) {
        }
      }
      
      try {
        const remoteUsers = await Remote.getUsersRemote(filter);
        
        try {
          await Local.saveUsersLocal(remoteUsers);
        } catch (saveError) {
        }
        
        return remoteUsers;
      } catch (error) {
        return await Local.getUsersLocal(filter);
      }
    } else {
      return await Local.getUsersLocal(filter);
    }
  },

  approveUser: async (userId: string): Promise<void> => {
    const approvedUser = await Local.approveUserLocal(userId);
    if (!approvedUser) {
      const localUsers = await Local.getUsersLocal();
      const userExists = localUsers.find(u => u.id === userId && u.status === 'active');
      
      if (userExists) {
        return;
      }
      
      throw new Error(`Pending user not found: ${userId}`);
    }
    
    try {
      await Local.recalculateReportsFromLocal();
    } catch (recalcError) {
    }
    
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      try {
        await Remote.approveUserRemote(userId);
        SyncWorker.processQueue().catch(() => {});
      } catch (error) {
        await SyncQueue.enqueue('APPROVE_USER', { userId });
      }
    } else {
      await SyncQueue.enqueue('APPROVE_USER', { userId });
    }
  },

  rejectUser: async (userId: string): Promise<void> => {
    try {
      await Local.rejectUserLocal(userId);
    } catch (error) {
      const pendingUsers = await Local.getPendingUsersLocal();
      const userStillPending = pendingUsers.find(u => u.id === userId);
      
      if (!userStillPending) {
        return;
      }
      
      throw error;
    }
    
    try {
      await Local.recalculateReportsFromLocal();
    } catch (recalcError) {
    }
    
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      try {
        await Remote.rejectUserRemote(userId);
        SyncWorker.processQueue().catch(() => {});
      } catch (error) {
        await SyncQueue.enqueue('REJECT_USER', { userId });
      }
    } else {
      await SyncQueue.enqueue('REJECT_USER', { userId });
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive'): Promise<void> => {
    await Local.updateUserStatusLocal(userId, status);
    
    try {
      await Local.recalculateReportsFromLocal();
    } catch (recalcError) {
    }
    
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      try {
        await Remote.updateUserStatusRemote(userId, status);
        SyncWorker.processQueue().catch(() => {});
      } catch (error) {
        await SyncQueue.enqueue('UPDATE_USER_STATUS', { userId, status });
      }
    } else {
      await SyncQueue.enqueue('UPDATE_USER_STATUS', { userId, status });
    }
  },

  getUserRequests: async (userId: string, filter?: string): Promise<TeamRequest[]> => {
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      try {
        const remoteRequests = await Remote.getUserRequestsRemote(userId);
        
        try {
          await Local.saveRequestsLocal(remoteRequests);
        } catch (saveError) {
        }
      } catch (error) {
      }
    }
    
    return await Local.getUserRequestsLocal(userId, filter);
  },

  approveRequest: async (requestId: string, notes?: string): Promise<void> => {
    await Local.updateRequestStatusLocal(requestId, 'approved', notes);
    
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      try {
        await Remote.approveRequestRemote(requestId, notes);
        SyncWorker.processQueue().catch(() => {});
      } catch (error) {
        await SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes });
      }
    } else {
      await SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes });
    }
  },

  rejectRequest: async (requestId: string, notes?: string): Promise<void> => {
    await Local.updateRequestStatusLocal(requestId, 'rejected', notes);
    
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      try {
        await Remote.rejectRequestRemote(requestId, notes);
        SyncWorker.processQueue().catch(() => {});
      } catch (error) {
        await SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes });
      }
    } else {
      await SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes });
    }
  },
};

const getReportsFromLocalDatabase = async (): Promise<AdminReports> => {
  try {
    const db = await getDatabase();
    
    const requests = await db.getAllAsync<{
      id: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>('SELECT id, status, created_at, updated_at FROM vacation_requests ORDER BY created_at DESC', []);
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const totalRequests = requests.length;
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    
    const requestsThisMonth = requests.filter(r => {
      const requestDate = new Date(r.created_at);
      return requestDate >= monthStart;
    });
    const newRequestsThisMonth = requestsThisMonth.length;
    const approvedRequestsThisMonth = requestsThisMonth.filter(r => r.status === 'approved').length;
    
    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      rejectedRequests,
      totalCollaborators: 0,
      totalManagers: 0,
      activeCollaborators: 0,
      pendingRegistrations: 0,
      newRequestsThisMonth,
      approvedRequestsThisMonth,
      newRegistrationsThisMonth: 0,
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

