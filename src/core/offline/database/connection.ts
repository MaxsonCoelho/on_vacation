import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    try {
      const db = await SQLite.openDatabaseAsync('on_vacation.db');
      dbInstance = db;
      return db;
    } catch (error) {
      console.error('[Database] Failed to open database:', error);
      dbPromise = null; // Reset promise on failure so we can try again
      throw error;
    }
  })();

  return dbPromise;
};
