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

const updateLocalRequestNames = async (requests: TeamRequest[]): Promise<void> => {
  try {
    const userIdsToUpdate = [...new Set(
      requests
        .filter(r => !r.employeeName || r.employeeName === 'Unknown')
        .map(r => r.employeeId)
    )];

    if (userIdsToUpdate.length === 0) return;

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIdsToUpdate);

    if (!profilesData || profilesData.length === 0) {
      return;
    }

    const profilesMap = new Map(profilesData.map(p => [p.id, p]));

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
    const localResult = await Local.getTeamRequestsLocal(limit, offset, filter);
    let requests = localResult.data;
    let hasMore = localResult.total ? offset + limit < localResult.total : false;
    let total = localResult.total;
    
    if (offset === 0) {
      try {
        const remoteResult = await Remote.getTeamRequestsRemote(limit, offset, filter);
        
        if (remoteResult.data.length > 0) {
          try {
            await Local.saveRequestsLocal(remoteResult.data);
            const refreshedLocal = await Local.getTeamRequestsLocal(limit, offset, filter);
            requests = refreshedLocal.data;
            total = remoteResult.total || refreshedLocal.total;
            hasMore = total ? offset + limit < total : false;
          } catch (saveError) {
            requests = remoteResult.data;
            total = remoteResult.total;
            hasMore = total ? offset + limit < total : false;
          }
        } else if (requests.length > 0) {
          await updateLocalRequestNames(requests);
          const refreshedLocal = await Local.getTeamRequestsLocal(limit, offset, filter);
          requests = refreshedLocal.data;
        }
      } catch (e) {
        if (requests.length > 0) {
          await updateLocalRequestNames(requests);
          const refreshedLocal = await Local.getTeamRequestsLocal(limit, offset, filter);
          requests = refreshedLocal.data;
          hasMore = refreshedLocal.total ? offset + limit < refreshedLocal.total : false;
          total = refreshedLocal.total;
        }
      }
    }
    
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (total === undefined) {
      hasMore = requests.length === limit;
    }
    
    return { data: requests, hasMore, total };
  },

  approveRequest: async (requestId: string, notes?: string): Promise<void> => {
    await Local.updateRequestStatusLocal(requestId, 'approved', notes);
    
    const networkCheck = Promise.race([
      NetInfo.fetch(),
      new Promise(resolve => setTimeout(() => resolve({ isConnected: false }), 500))
    ]) as Promise<{ isConnected: boolean }>;
    
    const sessionCheck = Promise.race([
      supabase.auth.getSession().then(({ data }) => data.session),
      new Promise(resolve => setTimeout(() => resolve(null), 500))
    ]) as Promise<any>;
    
    const [netState, session] = await Promise.all([networkCheck, sessionCheck]);
    
    if (netState?.isConnected && session) {
      Remote.approveRequestRemote(requestId, notes)
        .then(() => {
          SyncWorker.processQueue().catch(() => {});
        })
        .catch(() => {
          SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes }).catch(() => {});
        });
    } else {
      SyncQueue.enqueue('APPROVE_REQUEST', { requestId, notes }).catch(() => {});
    }
  },

  rejectRequest: async (requestId: string, notes?: string): Promise<void> => {
    await Local.updateRequestStatusLocal(requestId, 'rejected', notes);
    
    const networkCheck = Promise.race([
      NetInfo.fetch(),
      new Promise(resolve => setTimeout(() => resolve({ isConnected: false }), 500))
    ]) as Promise<{ isConnected: boolean }>;
    
    const sessionCheck = Promise.race([
      supabase.auth.getSession().then(({ data }) => data.session),
      new Promise(resolve => setTimeout(() => resolve(null), 500))
    ]) as Promise<any>;
    
    const [netState, session] = await Promise.all([networkCheck, sessionCheck]);
    
    if (netState?.isConnected && session) {
      Remote.rejectRequestRemote(requestId, notes)
        .then(() => {
          SyncWorker.processQueue().catch(() => {});
        })
        .catch(() => {
          SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes }).catch(() => {});
        });
    } else {
      SyncQueue.enqueue('REJECT_REQUEST', { requestId, notes }).catch(() => {});
    }
  }
};
