export type SyncStatus = 'pending' | 'processing' | 'failed' | 'completed';

export interface QueueItem<T = any> {
  id: string;
  type: string;
  payload: T;
  createdAt: number;
  retryCount: number;
  status: SyncStatus;
}
