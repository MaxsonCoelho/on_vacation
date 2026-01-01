import * as SQLite from 'expo-sqlite';

const DB_NAME = 'on_vacation.db';

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync(DB_NAME);
};

export const initDB = async () => {
  try {
    const db = await getDBConnection();
    // Para simplificar em ambiente de dev: Se a tabela não tiver as novas colunas, vamos recriá-la
    // Em produção, usaríamos migrations.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS auth_session (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        avatar TEXT
      );
    `);
    console.log('[SQLite] Banco de dados inicializado.');
  } catch (error) {
    console.error('[SQLite] Erro ao inicializar banco:', error);
  }
};
