import { QueueRepository } from './QueueRepository';
import { QueueItem } from './QueueEntity';

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
    return item;
  }
};
