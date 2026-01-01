import { getDBConnection } from '../services/sqlite';

export const saveSession = async (id: string, email: string, name: string, role: string, status: string, created_at: string, avatar?: string) => {
  try {
    const db = await getDBConnection();
    await db.runAsync(
      'INSERT OR REPLACE INTO auth_session (id, email, name, role, status, created_at, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, email, name, role, status, created_at, avatar || null]
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
    await db.runAsync('DELETE FROM auth_session');
    console.log('[SQLite] Sessão limpa.');
  } catch (error) {
    console.error('[SQLite] Erro ao limpar sessão:', error);
    throw error;
  }
};
