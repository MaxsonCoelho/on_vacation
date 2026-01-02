import { create } from 'zustand';

interface OfflineState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  setOnlineStatus: (status: boolean) => void;
  setSyncing: (status: boolean) => void;
  setPendingCount: (count: number) => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: true, // Default assumption
  isSyncing: false,
  pendingCount: 0,
  setOnlineStatus: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
}));
