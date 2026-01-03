import { create } from 'zustand';
import { Manager } from '../../domain/entities/Manager';
import { TeamRequest } from '../../domain/entities/TeamRequest';
import { ManagerRepositoryImpl } from '../../data/repositories/ManagerRepositoryImpl';
import { getManagerProfileUseCase } from '../../domain/useCases/GetManagerProfileUseCase';
import { getTeamRequestsUseCase } from '../../domain/useCases/GetTeamRequestsUseCase';
import { approveRequestUseCase } from '../../domain/useCases/ApproveRequestUseCase';
import { rejectRequestUseCase } from '../../domain/useCases/RejectRequestUseCase';
import { supabase } from '../../../../core/services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ManagerState {
  profile: Manager | null;
  requests: TeamRequest[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  
  fetchProfile: () => Promise<void>;
  fetchRequests: (filter?: string, showLoading?: boolean) => Promise<void>;
  approveRequest: (requestId: string, notes?: string) => Promise<void>;
  rejectRequest: (requestId: string, notes?: string) => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

export const useManagerStore = create<ManagerState>((set, get) => ({
  profile: null,
  requests: [],
  isLoading: false,
  error: null,
  subscription: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const getProfile = getManagerProfileUseCase(ManagerRepositoryImpl);
      const profile = await getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        set({ error: errorMessage, isLoading: false });
    }
  },

  fetchRequests: async (filter?: string, showLoading = true) => {
    // Only set loading if showLoading is true
    // This allows realtime updates to skip loading state to avoid flickering
    if (showLoading) {
        set({ isLoading: true, error: null });
    }
    
    try {
      const getRequests = getTeamRequestsUseCase(ManagerRepositoryImpl);
      const requests = await getRequests(filter);
      set({ requests, isLoading: false });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        set({ error: errorMessage, isLoading: false });
    }
  },

  subscribeToRealtime: () => {
      const { subscription, fetchRequests } = get();
      if (subscription) return; // Already subscribed

      const newSubscription = supabase
        .channel('public:vacation_requests')
        .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'vacation_requests' }, 
            () => {
                fetchRequests(undefined, false); // Refresh list without loading state
            }
        )
        .subscribe();

      set({ subscription: newSubscription });
  },

  unsubscribeFromRealtime: () => {
      const { subscription } = get();
      if (subscription) {
          supabase.removeChannel(subscription);
          set({ subscription: null });
      }
  },

  approveRequest: async (requestId: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const approve = approveRequestUseCase(ManagerRepositoryImpl);
      await approve(requestId, notes);
      
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.map(r => 
        r.id === requestId ? { ...r, status: 'approved' as const } : r
      );
      
      set({ requests: updatedRequests, isLoading: false });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        set({ error: errorMessage, isLoading: false });
        throw error;
    }
  },

  rejectRequest: async (requestId: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const reject = rejectRequestUseCase(ManagerRepositoryImpl);
      await reject(requestId, notes);
      
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' as const } : r
      );
      
      set({ requests: updatedRequests, isLoading: false });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        set({ error: errorMessage, isLoading: false });
        throw error;
    }
  }
}));
