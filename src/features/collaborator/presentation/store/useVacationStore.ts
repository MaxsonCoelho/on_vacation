import { create } from 'zustand';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { getVacationRequestsUseCase } from '../../domain/useCases/GetVacationRequestsUseCase';
import { createVacationRequestUseCase } from '../../domain/useCases/CreateVacationRequestUseCase';
import { VacationRepositoryImpl } from '../../data/repositories/VacationRepositoryImpl';
import { supabase } from '../../../../core/services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface VacationState {
  requests: VacationRequest[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  subscribersCount: number;
  
  fetchRequests: (userId: string) => Promise<void>;
  createRequest: (request: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'>) => Promise<void>;
  subscribeToRealtime: (userId: string) => void;
  unsubscribeFromRealtime: () => void;
}

export const useVacationStore = create<VacationState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,
  subscription: null,
  subscribersCount: 0,

  fetchRequests: async (userId: string) => {
    console.log('[useVacationStore] Fetching requests for user:', userId);
    // Only show loading on initial empty state to avoid flickering
    if (get().requests.length === 0) {
        set({ isLoading: true, error: null });
    }
    
    try {
      const getRequests = getVacationRequestsUseCase(VacationRepositoryImpl);
      const requests = await getRequests(userId);
      console.log('[useVacationStore] Fetched requests count:', requests.length);
      set({ requests, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[useVacationStore] Error fetching requests:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  subscribeToRealtime: (userId: string) => {
      const { subscription, subscribersCount, fetchRequests } = get();
      
      const newCount = subscribersCount + 1;
      set({ subscribersCount: newCount });
      console.log(`[useVacationStore] Subscribing... Count: ${newCount}`);

      if (subscription) return;

      console.log('[useVacationStore] Initializing Supabase subscription for user:', userId);
      const newSubscription = supabase
        .channel(`public:vacation_requests:user:${userId}`)
        .on(
            'postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'vacation_requests',
                filter: `user_id=eq.${userId}`
            }, 
            (payload) => {
                console.log('[useVacationStore] Realtime update received:', payload);
                fetchRequests(userId);
            }
        )
        .subscribe();

      set({ subscription: newSubscription });
  },

  unsubscribeFromRealtime: () => {
      const { subscription, subscribersCount } = get();
      
      const newCount = Math.max(0, subscribersCount - 1);
      set({ subscribersCount: newCount });
      console.log(`[useVacationStore] Unsubscribing... Count: ${newCount}`);

      if (newCount === 0 && subscription) {
          console.log('[useVacationStore] Removing Supabase subscription (no listeners left)');
          supabase.removeChannel(subscription);
          set({ subscription: null });
      }
  },

  createRequest: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const create = createVacationRequestUseCase(VacationRepositoryImpl);
      await create(request);
      
      set({ isLoading: false });
      // Refresh requests after creation
      const getRequests = getVacationRequestsUseCase(VacationRepositoryImpl);
      const requests = await getRequests(request.userId);
      set({ requests });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));
