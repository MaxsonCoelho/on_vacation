import { getDatabase } from './connection';
import { 
  SYNC_QUEUE_TABLE, 
  AUTH_SESSION_TABLE, 
  VACATION_REQUESTS_TABLE,
  ADMIN_REPORTS_TABLE,
  ADMIN_PENDING_USERS_TABLE,
  ADMIN_USERS_TABLE
} from './schema';

export const runMigrations = async () => {
  const db = await getDatabase();
  
  try {
    await db.execAsync(SYNC_QUEUE_TABLE);
    await db.execAsync(AUTH_SESSION_TABLE);
    await db.execAsync(VACATION_REQUESTS_TABLE);
    await db.execAsync(ADMIN_REPORTS_TABLE);
    await db.execAsync(ADMIN_PENDING_USERS_TABLE);
    await db.execAsync(ADMIN_USERS_TABLE);

    // Migration to add missing columns for Manager feature if they don't exist
    // SQLite doesn't support IF NOT EXISTS for ADD COLUMN in older versions, 
    // so we wrap in try/catch or just ignore error if column exists.
    try {
      await db.execAsync(`ALTER TABLE vacation_requests ADD COLUMN requester_name TEXT;`);
    } catch {
      // Column likely already exists
    }

    try {
      await db.execAsync(`ALTER TABLE vacation_requests ADD COLUMN requester_avatar TEXT;`);
    } catch {
      // Column likely already exists
    }
  } catch (error) {
    console.error('[Offline] Error executing migrations:', error);
    throw error;
  }
};
