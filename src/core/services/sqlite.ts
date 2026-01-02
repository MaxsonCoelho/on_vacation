import { AUTH_SESSION_TABLE, SYNC_QUEUE_TABLE, VACATION_REQUESTS_TABLE } from '../offline/database/schema';
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
    await db.execAsync(AUTH_SESSION_TABLE);
    await db.execAsync(SYNC_QUEUE_TABLE);
    await db.execAsync(VACATION_REQUESTS_TABLE);
    
    console.log('[SQLite] Banco de dados inicializado.');
  } catch (error) {
    console.error('[SQLite] Erro ao inicializar banco:', error);
  }
};
