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
  isLoadingMore: boolean;
  hasMore: boolean;
  currentFilter: string | undefined;
  error: string | null;
  subscription: RealtimeChannel | null;
  
  fetchProfile: () => Promise<void>;
  fetchRequests: (filter?: string, reset?: boolean) => Promise<void>;
  loadMoreRequests: () => Promise<void>;
  approveRequest: (requestId: string, notes?: string) => Promise<void>;
  rejectRequest: (requestId: string, notes?: string) => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

const PAGE_SIZE = 10;

export const useManagerStore = create<ManagerState>((set, get) => ({
  profile: null,
  requests: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  currentFilter: undefined,
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

  fetchRequests: async (filter?: string, reset: boolean = true) => {
    const { currentFilter } = get();
    
    // Se o filtro mudou ou é reset, limpa e recarrega
    if (reset || filter !== currentFilter) {
      set({ isLoading: true, error: null, requests: [], hasMore: true, currentFilter: filter });
    } else {
      set({ isLoading: true, error: null });
    }
    
    try {
      const getRequests = getTeamRequestsUseCase(ManagerRepositoryImpl);
      const result = await getRequests(filter, PAGE_SIZE, 0);
      set({ 
        requests: result.data, 
        hasMore: result.hasMore,
        isLoading: false 
      });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        set({ error: errorMessage, isLoading: false });
    }
  },

  loadMoreRequests: async () => {
    const { requests, isLoadingMore, hasMore, currentFilter } = get();
    
    if (isLoadingMore || !hasMore) {
      return;
    }
    
    set({ isLoadingMore: true, error: null });
    
    try {
      const getRequests = getTeamRequestsUseCase(ManagerRepositoryImpl);
      const offset = requests.length;
      const result = await getRequests(currentFilter, PAGE_SIZE, offset);
      
      set({ 
        requests: [...requests, ...result.data],
        hasMore: result.hasMore,
        isLoadingMore: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoadingMore: false });
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
                const { currentFilter } = get();
                fetchRequests(currentFilter, false); // Refresh list without loading state
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
    // Atualização otimista imediata para UI responsiva (especialmente offline)
    const currentRequests = get().requests;
    const updatedRequests = currentRequests.map(r => 
      r.id === requestId ? { ...r, status: 'approved' as const, managerNotes: notes } : r
    );
    set({ requests: updatedRequests, isLoading: false, error: null });
    
    // Executa aprovação em background (não bloqueia UI)
    try {
      const approve = approveRequestUseCase(ManagerRepositoryImpl);
      await approve(requestId, notes);
      
      // Se houver diferenças após sincronização, atualiza novamente
      // (raramente necessário, mas garante consistência)
      const finalRequests = get().requests;
      if (finalRequests.find(r => r.id === requestId)?.status !== 'approved') {
        set({ requests: updatedRequests });
      }
    } catch (error) {
      // Se falhar, reverte para estado anterior
      set({ requests: currentRequests });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage });
      throw error;
    }
  },

  rejectRequest: async (requestId: string, notes?: string) => {
    // Atualização otimista imediata para UI responsiva (especialmente offline)
    const currentRequests = get().requests;
    const updatedRequests = currentRequests.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const, managerNotes: notes } : r
    );
    set({ requests: updatedRequests, isLoading: false, error: null });
    
    // Executa rejeição em background (não bloqueia UI)
    try {
      const reject = rejectRequestUseCase(ManagerRepositoryImpl);
      await reject(requestId, notes);
      
      // Se houver diferenças após sincronização, atualiza novamente
      // (raramente necessário, mas garante consistência)
      const finalRequests = get().requests;
      if (finalRequests.find(r => r.id === requestId)?.status !== 'rejected') {
        set({ requests: updatedRequests });
      }
    } catch (error) {
      // Se falhar, reverte para estado anterior
      set({ requests: currentRequests });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage });
      throw error;
    }
  }
}));
