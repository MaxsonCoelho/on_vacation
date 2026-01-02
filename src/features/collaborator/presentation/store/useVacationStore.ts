import { create } from 'zustand';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { getVacationRequestsUseCase } from '../../domain/useCases/GetVacationRequestsUseCase';
import { createVacationRequestUseCase } from '../../domain/useCases/CreateVacationRequestUseCase';
import { VacationRepositoryImpl } from '../../data/repositories/VacationRepositoryImpl';

interface VacationState {
  requests: VacationRequest[];
  isLoading: boolean;
  error: string | null;
  fetchRequests: (userId: string) => Promise<void>;
  createRequest: (request: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'>) => Promise<void>;
}

export const useVacationStore = create<VacationState>((set) => ({
  requests: [],
  isLoading: false,
  error: null,
  fetchRequests: async (userId: string) => {
    console.log('[useVacationStore] Fetching requests for user:', userId);
    set({ isLoading: true, error: null });
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
