import { getDatabase } from './connection';
import { SYNC_QUEUE_TABLE, AUTH_SESSION_TABLE, VACATION_REQUESTS_TABLE } from './schema';

export const runMigrations = async () => {
  const db = await getDatabase();
  
  try {
    await db.execAsync(SYNC_QUEUE_TABLE);
    await db.execAsync(AUTH_SESSION_TABLE);
    await db.execAsync(VACATION_REQUESTS_TABLE);
    console.log('[Offline] Migrations executed successfully');
  } catch (error) {
    console.error('[Offline] Error executing migrations:', error);
    throw error;
  }
};
