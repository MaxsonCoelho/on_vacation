import { runMigrations } from './database/migrations';

export const initOfflineDatabase = async () => {
  await runMigrations();
};
