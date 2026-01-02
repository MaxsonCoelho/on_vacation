import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '../store';
import { SyncEngine } from '../sync/SyncEngine';

export const NetworkMonitor = {
  init: () => {
    // Initial check
    NetInfo.fetch().then(state => {
      useOfflineStore.getState().setOnlineStatus(!!state.isConnected);
    });

    // Subscribe to updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = !!state.isConnected;
      const wasOffline = !useOfflineStore.getState().isOnline;
      
      useOfflineStore.getState().setOnlineStatus(isOnline);

      if (isOnline && wasOffline) {
        console.log('[Offline] Connection restored. Triggering sync...');
        SyncEngine.start();
      }
    });

    return unsubscribe;
  }
};
