import { getDatabase } from '../database/connection';
import { QueueItem, SyncStatus } from './QueueEntity';

// Helper para evitar SQL Injection em strings interpoladas manualmente
const escape = (str: string) => str.replace(/'/g, "''");

interface QueueItemDB {
  id: string;
  type: string;
  payload: string;
  created_at: number;
  retry_count: number;
  status: string;
}

export const QueueRepository = {
  add: async (item: QueueItem) => {
    const db = await getDatabase();
    // Workaround for Android NPE: Manually interpolate and use execAsync
    const payloadStr = JSON.stringify(item.payload);
    await db.execAsync(
      `INSERT INTO sync_queue (id, type, payload, created_at, retry_count, status) VALUES (
        '${item.id}', 
        '${escape(item.type)}', 
        '${escape(payloadStr)}', 
        '${item.createdAt}', 
        ${item.retryCount}, 
        '${item.status}'
      )`
    );
  },

  getPending: async (): Promise<QueueItem[]> => {
    const db = await getDatabase();
    // Workaround: Manually interpolate and pass empty array
    const result = await db.getAllAsync(
      `SELECT * FROM sync_queue WHERE status = 'pending' OR status = 'failed' ORDER BY created_at ASC`,
      []
    );

    return (result as QueueItemDB[]).map(row => ({
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
    await db.execAsync(
      `UPDATE sync_queue SET status = '${status}' WHERE id = '${id}'`
    );
  },

  incrementRetry: async (id: string) => {
    const db = await getDatabase();
    await db.execAsync(
      `UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = '${id}'`
    );
  },

  remove: async (id: string) => {
    const db = await getDatabase();
    await db.execAsync(
      `DELETE FROM sync_queue WHERE id = '${id}'`
    );
  }
};
