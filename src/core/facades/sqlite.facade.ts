import { getDatabase } from '../offline/database/connection';

export const saveSession = async (id: string, email: string, name: string, role: string, status: string, created_at: string, avatar?: string) => {
  try {
    const db = await getDatabase();
    // Using parameterized query with runAsync to prevent SQL injection and Android NPE issues
    await db.runAsync(
      'INSERT OR REPLACE INTO auth_session (id, email, name, role, status, created_at, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, email, name, role, status, created_at, avatar ?? null]
    );
  } catch (error) {
    console.error('[SQLite] Erro ao salvar sessão:', error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const db = await getDatabase();
    // Using parameterized query correctly with getAllAsync
    const result = await db.getAllAsync<{
      id: string;
      email: string;
      name: string;
      role: string;
      status: string;
      created_at: string;
      avatar: string;
    }>('SELECT * FROM auth_session LIMIT 1');
    return result[0] || null;
  } catch (error) {
    console.error('[SQLite] Erro ao buscar sessão:', error);
    return null;
  }
};

export const clearSession = async () => {
  try {
    const db = await getDatabase();
    // Use runAsync for delete
    await db.runAsync('DELETE FROM auth_session');
  } catch (error) {
    console.error('[SQLite] Erro ao limpar sessão:', error);
    throw error;
  }
};

/**
 * TEST ONLY: Resets the database to a clean state.
 * This is used for integration testing to ensure isolation.
 */
export const _test_resetDB = async () => {
  if (process.env.NODE_ENV !== 'test') {
    return;
  }
  await clearSession();
  
  // Clear other tables
  try {
    const db = await getDatabase();
    await db.execAsync('DELETE FROM vacation_requests');
    await db.execAsync('DELETE FROM sync_queue');
  } catch {
    // Tables might not exist yet, which is fine
  }
};
