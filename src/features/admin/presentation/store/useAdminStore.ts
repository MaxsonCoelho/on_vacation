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
      try {
        const approve = approveUserUseCase(AdminRepositoryImpl);
        await approve(userId);
        
        // Atualiza estado local
        const currentPendingUsers = get().pendingUsers;
        const updatedPendingUsers = currentPendingUsers.filter(u => u.id !== userId);
        
        // Busca o usuário aprovado localmente para adicionar à lista de usuários ativos
        const { getUsersLocal } = await import('../../data/datasources/local/AdminLocalDataSource');
        const localUsers = await getUsersLocal();
        const approvedUser = localUsers.find(u => u.id === userId);
        
        const currentUsers = get().users;
        let updatedUsers = currentUsers;
        
        // Se encontrou o usuário aprovado localmente, adiciona à lista (evita duplicatas)
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
        
        // Atualiza relatórios (sem lançar erro se falhar)
        get().fetchReports(false).catch(err => {
          console.warn('[AdminStore] Error fetching reports after approval (non-critical):', err);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Verifica se o erro é porque não encontrou o usuário pendente (pode acontecer offline)
        // Se funcionou localmente (usuário foi removido de pending), não é um erro real
        const currentPendingUsers = get().pendingUsers;
        const userStillPending = currentPendingUsers.find(u => u.id === userId);
        
        // Se o usuário não está mais em pending, significa que funcionou localmente
        // Só lança erro se realmente falhou (usuário ainda está em pending)
        if (userStillPending) {
          console.error('[AdminStore] Error approving user:', errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw error;
        } else {
          // Funcionou localmente, apenas loga mas não lança erro
          console.log('[AdminStore] User approved locally (offline mode). Error was non-critical:', errorMessage);
          set({ isLoading: false });
        }
      }
    },

  rejectUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reject = rejectUserUseCase(AdminRepositoryImpl);
      await reject(userId);
      
      // Atualiza estado local
      const currentPendingUsers = get().pendingUsers;
      const updatedPendingUsers = currentPendingUsers.filter(u => u.id !== userId);
      set({ pendingUsers: updatedPendingUsers, isLoading: false });
      
      // Atualiza relatórios (sem lançar erro se falhar)
      get().fetchReports(false).catch(err => {
        console.warn('[AdminStore] Error fetching reports after rejection (non-critical):', err);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AdminStore] Error rejecting user:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive') => {
    set({ isLoading: true, error: null });
    try {
      const updateStatus = updateUserStatusUseCase(AdminRepositoryImpl);
      await updateStatus(userId, status);
      
      // Atualiza estado local
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(u => 
        u.id === userId ? { ...u, status } : u
      );
      set({ users: updatedUsers, isLoading: false });
      
      // Atualiza relatórios (sem lançar erro se falhar)
      get().fetchReports(false).catch(err => {
        console.warn('[AdminStore] Error fetching reports after status update (non-critical):', err);
      });
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
    console.log(`[AdminStore] Subscribing... Count: ${newCount}`);

    if (subscription) return;

    console.log('[AdminStore] Initializing Supabase subscription...');
    const newSubscription = supabase
      .channel('admin:updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vacation_requests' },
        async (payload) => {
          console.log('[AdminStore] Vacation request update received:', payload.eventType, payload.new || payload.old);
          
          // Pequeno delay para garantir que a mudança foi persistida
          setTimeout(() => {
            console.log('[AdminStore] Refreshing reports after vacation_requests change...');
            fetchReports(false); // Atualiza relatórios sem loading
          }, 500);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async (payload) => {
          console.log('[AdminStore] Profile update received:', payload.eventType, payload.new || payload.old);
          
          // Pequeno delay para garantir que a mudança foi persistida
          setTimeout(() => {
            console.log('[AdminStore] Refreshing data after profiles change...');
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
    console.log(`[AdminStore] Unsubscribing... Count: ${newCount}`);

    if (newCount === 0 && subscription) {
      console.log('[AdminStore] Removing Supabase subscription (no listeners left)');
      supabase.removeChannel(subscription);
      set({ subscription: null });
    }
  },
}));

