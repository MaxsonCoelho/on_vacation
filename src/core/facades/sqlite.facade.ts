import { getDBConnection } from '../services/sqlite';

export const saveSession = async (id: string, email: string, name: string, role: string, status: string, created_at: string, avatar?: string) => {
  try {
    const db = await getDBConnection();
    await db.runAsync(
      'INSERT OR REPLACE INTO auth_session (id, email, name, role, status, created_at, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, email, name, role, status, created_at, avatar || '']
    );
    console.log('[SQLite] Sessão salva.');
  } catch (error) {
    console.error('[SQLite] Erro ao salvar sessão:', error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const db = await getDBConnection();
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
    const db = await getDBConnection();
    // Use execAsync for simple delete without parameters to avoid prepareAsync issues
    await db.execAsync('DELETE FROM auth_session');
    console.log('[SQLite] Sessão limpa.');
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
    console.warn('Attempted to reset DB outside of test environment');
    return;
  }
  await clearSession();
  
  // Clear other tables
  try {
    const db = await getDBConnection();
    await db.execAsync('DELETE FROM vacation_requests');
    await db.execAsync('DELETE FROM sync_queue');
    console.log('[SQLite] DB reset complete (session, vacation_requests, sync_queue).');
  } catch (error) {
    // Tables might not exist yet, which is fine
    console.log('[SQLite] DB reset partial (tables might not exist).', error);
  }
};
