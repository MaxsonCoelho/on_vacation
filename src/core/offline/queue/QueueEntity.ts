export type SyncStatus = 'pending' | 'processing' | 'failed' | 'completed';

export interface QueueItem<T = unknown> {
  id: string;
  type: string;
  payload: T;
  createdAt: number;
  retryCount: number;
  status: SyncStatus;
}
