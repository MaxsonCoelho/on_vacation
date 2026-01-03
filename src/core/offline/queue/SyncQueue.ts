import { QueueRepository } from './QueueRepository';
import { QueueItem } from './QueueEntity';
import { SyncWorker } from './SyncWorker';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../services/supabase';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const SyncQueue = {
  enqueue: async <T>(type: string, payload: T) => {
    const item: QueueItem<T> = {
      id: generateId(),
      type,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
      status: 'pending'
    };

    await QueueRepository.add(item);
    
    // Verifica se está online antes de tentar processar imediatamente
    // Isso evita logs de erro desnecessários quando offline
    const netState = await NetInfo.fetch();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (netState.isConnected && session) {
      // Trigger sync immediately only if online (fire and forget)
      // This ensures "online" behavior is fast
      SyncWorker.processQueue().catch(err => {
        console.warn('[SyncQueue] Auto-sync failed (will retry later):', err);
      });
    } else {
      console.log(`[SyncQueue] Item ${item.id} (type: ${item.type}) queued for sync when connection is restored`);
    }
    
    return item;
  }
};
