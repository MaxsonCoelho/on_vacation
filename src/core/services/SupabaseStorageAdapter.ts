import { AsyncStorageFacade } from '../facades/AsyncStorageFacade';

//Este adapter evita acoplar o Supabase à interface interna da Facade,
//mantendo a separação de responsabilidades.
export const SupabaseStorageAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return AsyncStorageFacade.get(key);
  },

  setItem: (key: string, value: string): Promise<void> => {
    return AsyncStorageFacade.set(key, value);
  },

  removeItem: (key: string): Promise<void> => {
    return AsyncStorageFacade.remove(key);
  },
};

