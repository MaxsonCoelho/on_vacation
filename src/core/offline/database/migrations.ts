import { getDatabase } from './connection';
import { SYNC_QUEUE_TABLE, AUTH_SESSION_TABLE, VACATION_REQUESTS_TABLE } from './schema';

export const runMigrations = async () => {
  const db = await getDatabase();
  
  try {
    await db.execAsync(SYNC_QUEUE_TABLE);
    await db.execAsync(AUTH_SESSION_TABLE);
    await db.execAsync(VACATION_REQUESTS_TABLE);

    // Migration to add missing columns for Manager feature if they don't exist
    // SQLite doesn't support IF NOT EXISTS for ADD COLUMN in older versions, 
    // so we wrap in try/catch or just ignore error if column exists.
    try {
      await db.execAsync(`ALTER TABLE vacation_requests ADD COLUMN requester_name TEXT;`);
      console.log('[Offline] Added requester_name column');
    } catch {
      // Column likely already exists
    }

    try {
      await db.execAsync(`ALTER TABLE vacation_requests ADD COLUMN requester_avatar TEXT;`);
      console.log('[Offline] Added requester_avatar column');
    } catch {
      // Column likely already exists
    }

    console.log('[Offline] Migrations executed successfully');
  } catch (error) {
    console.error('[Offline] Error executing migrations:', error);
    throw error;
  }
};
