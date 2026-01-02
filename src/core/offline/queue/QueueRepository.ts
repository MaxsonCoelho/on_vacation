import { getDatabase } from '../database/connection';
import { QueueItem, SyncStatus } from './QueueEntity';

export const QueueRepository = {
  add: async (item: QueueItem) => {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO sync_queue (id, type, payload, created_at, retry_count, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.id, item.type, JSON.stringify(item.payload), item.createdAt, item.retryCount, item.status]
    );
  },

  getPending: async (): Promise<QueueItem[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync(
      `SELECT * FROM sync_queue WHERE status = ? OR status = ? ORDER BY created_at ASC`,
      ['pending', 'failed']
    );

    return (result as any[]).map(row => ({
      id: row.id,
      type: row.type,
      payload: JSON.parse(row.payload),
      createdAt: row.created_at,
      retryCount: row.retry_count,
      status: row.status as SyncStatus
    }));
  },

  updateStatus: async (id: string, status: SyncStatus) => {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE sync_queue SET status = ? WHERE id = ?`,
      [status, id]
    );
  },

  incrementRetry: async (id: string) => {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?`,
      [id]
    );
  },

  remove: async (id: string) => {
    const db = await getDatabase();
    await db.runAsync(
      `DELETE FROM sync_queue WHERE id = ?`,
      [id]
    );
  }
};
