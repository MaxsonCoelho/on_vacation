import { QueueRepository } from '../queue/QueueRepository';
import { SyncStrategies } from './SyncStrategies';
import { useOfflineStore } from '../store';

export const SyncEngine = {
  start: async () => {
    const store = useOfflineStore.getState();
    
    if (store.isSyncing || !store.isOnline) {
      return;
    }

    store.setSyncing(true);

    try {
      const pendingItems = await QueueRepository.getPending();
      store.setPendingCount(pendingItems.length);

      for (const item of pendingItems) {
        const strategy = SyncStrategies.get(item.type);

        if (!strategy) {
          // Mark as failed so we don't loop forever? Or keep pending?
          // Let's mark as failed for now.
          await QueueRepository.updateStatus(item.id, 'failed');
          continue;
        }

        try {
          await QueueRepository.updateStatus(item.id, 'processing');
          
          await strategy(item.payload);
          
          await QueueRepository.remove(item.id);
        } catch (error) {
          console.error(`[SyncEngine] Error processing item ${item.id}:`, error);
          await QueueRepository.incrementRetry(item.id);
          await QueueRepository.updateStatus(item.id, 'failed');
        }
      }
    } catch (error) {
      console.error('[SyncEngine] Critical error during sync:', error);
    } finally {
      const remaining = (await QueueRepository.getPending()).length;
      store.setPendingCount(remaining);
      store.setSyncing(false);
    }
  }
};
