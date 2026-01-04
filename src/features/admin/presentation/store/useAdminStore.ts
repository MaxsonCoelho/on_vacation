import { create } from 'zustand';
import { AdminReports } from '../../domain/entities/AdminReports';
import { PendingUser } from '../../domain/entities/PendingUser';
import { User } from '../../domain/entities/User';
import { AdminRepositoryImpl } from '../../data/repositories/AdminRepositoryImpl';
import { getAdminReportsUseCase } from '../../domain/useCases/GetAdminReportsUseCase';
import { getPendingUsersUseCase } from '../../domain/useCases/GetPendingUsersUseCase';
import { getUsersUseCase } from '../../domain/useCases/GetUsersUseCase';
import { approveUserUseCase } from '../../domain/useCases/ApproveUserUseCase';
import { rejectUserUseCase } from '../../domain/useCases/RejectUserUseCase';
import { updateUserStatusUseCase } from '../../domain/useCases/UpdateUserStatusUseCase';
import { supabase } from '../../../../core/services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface AdminState {
  reports: AdminReports | null;
  pendingUsers: PendingUser[];
  users: User[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  subscribersCount: number;
  
  fetchReports: (showLoading?: boolean) => Promise<void>;
  fetchPendingUsers: (showLoading?: boolean) => Promise<void>;
  fetchUsers: (filter?: string, showLoading?: boolean) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  reports: null,
  pendingUsers: [],
  users: [],
  isLoading: false,
  error: null,
  subscription: null,
  subscribersCount: 0,

  fetchReports: async (showLoading = true) => {
    if (showLoading) {
      set({ isLoading: true, error: null });
    }
    
    try {
      const getReports = getAdminReportsUseCase(AdminRepositoryImpl);
      const reports = await getReports();
      set({ reports, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPendingUsers: async (showLoading = true) => {
    if (showLoading) {
      set({ isLoading: true, error: null });
    }
    
    try {
      const getPendingUsers = getPendingUsersUseCase(AdminRepositoryImpl);
      const pendingUsers = await getPendingUsers();
      set({ pendingUsers, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUsers: async (filter?: string, showLoading = true) => {
    if (showLoading) {
      set({ isLoading: true, error: null });
    }
    
    try {
      const getUsers = getUsersUseCase(AdminRepositoryImpl);
      const users = await getUsers(filter);
      set({ users, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
    }
  },

    approveUser: async (userId: string) => {
      set({ isLoading: true, error: null });
      
      const initialPendingUsers = get().pendingUsers;
      const userWasPending = initialPendingUsers.find(u => u.id === userId);
      
      try {
        const approve = approveUserUseCase(AdminRepositoryImpl);
        await approve(userId);
        
        const currentPendingUsers = get().pendingUsers;
        const updatedPendingUsers = currentPendingUsers.filter(u => u.id !== userId);
        
        const { getUsersLocal } = await import('../../data/datasources/local/AdminLocalDataSource');
        const localUsers = await getUsersLocal();
        const approvedUser = localUsers.find(u => u.id === userId);
        
        const currentUsers = get().users;
        let updatedUsers = currentUsers;
        
        if (approvedUser) {
          const userExists = currentUsers.find(u => u.id === userId);
          if (!userExists) {
            updatedUsers = [...currentUsers, approvedUser];
          }
        }
        
        set({ 
          pendingUsers: updatedPendingUsers, 
          users: updatedUsers,
          isLoading: false 
        });
        
        get().fetchReports(false).catch(() => {});
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Verifica se funcionou localmente apesar do erro (para operações offline)
        const { getUsersLocal } = await import('../../data/datasources/local/AdminLocalDataSource');
        const localUsers = await getUsersLocal();
        const approvedUserLocal = localUsers.find(u => u.id === userId);
        const currentPendingUsers = get().pendingUsers;
        const userStillPending = currentPendingUsers.find(u => u.id === userId);
        
        const workedLocally = approvedUserLocal || (!userStillPending && userWasPending);
        
        if (workedLocally) {
          const updatedPendingUsers = currentPendingUsers.filter(u => u.id !== userId);
          const currentUsers = get().users;
          let updatedUsers = currentUsers;
          
          if (approvedUserLocal) {
            const userExists = currentUsers.find(u => u.id === userId);
            if (!userExists) {
              updatedUsers = [...currentUsers, approvedUserLocal];
            }
          }
          
          set({ 
            pendingUsers: updatedPendingUsers, 
            users: updatedUsers,
            isLoading: false 
          });
        } else {
          console.error('[AdminStore] Error approving user:', errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      }
    },

  rejectUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    const initialPendingUsers = get().pendingUsers;
    const userWasPending = initialPendingUsers.find(u => u.id === userId);
    
    try {
      const reject = rejectUserUseCase(AdminRepositoryImpl);
      await reject(userId);
      
      const currentPendingUsers = get().pendingUsers;
      const updatedPendingUsers = currentPendingUsers.filter(u => u.id !== userId);
      set({ pendingUsers: updatedPendingUsers, isLoading: false });
      
      get().fetchReports(false).catch(() => {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Verifica se funcionou localmente apesar do erro (para operações offline)
      const currentPendingUsers = get().pendingUsers;
      const userStillPending = currentPendingUsers.find(u => u.id === userId);
      
      const workedLocally = !userStillPending && userWasPending;
      
      if (workedLocally) {
        const updatedPendingUsers = currentPendingUsers.filter(u => u.id !== userId);
        set({ pendingUsers: updatedPendingUsers, isLoading: false });
      } else {
        console.error('[AdminStore] Error rejecting user:', errorMessage);
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive') => {
    set({ isLoading: true, error: null });
    try {
      const updateStatus = updateUserStatusUseCase(AdminRepositoryImpl);
      await updateStatus(userId, status);
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(u => 
        u.id === userId ? { ...u, status } : u
      );
      set({ users: updatedUsers, isLoading: false });
      
      get().fetchReports(false).catch(() => {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AdminStore] Error updating user status:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  subscribeToRealtime: () => {
    const { subscription, subscribersCount, fetchReports, fetchPendingUsers, fetchUsers } = get();
    
    const newCount = subscribersCount + 1;
    set({ subscribersCount: newCount });

    if (subscription) return;

    const newSubscription = supabase
      .channel('admin:updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vacation_requests' },
        async () => {
          // Pequeno delay para garantir que a mudança foi persistida
          setTimeout(() => {
            fetchReports(false); // Atualiza relatórios sem loading
          }, 500);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async () => {
          // Pequeno delay para garantir que a mudança foi persistida
          setTimeout(() => {
            fetchReports(false); // Atualiza relatórios
            fetchPendingUsers(false); // Atualiza pendentes
            fetchUsers(undefined, false); // Atualiza usuários
          }, 500);
        }
      )
      .subscribe();

    set({ subscription: newSubscription });
  },

  unsubscribeFromRealtime: () => {
    const { subscription, subscribersCount } = get();
    
    const newCount = Math.max(0, subscribersCount - 1);
    set({ subscribersCount: newCount });

    if (newCount === 0 && subscription) {
      supabase.removeChannel(subscription);
      set({ subscription: null });
    }
  },
}));

