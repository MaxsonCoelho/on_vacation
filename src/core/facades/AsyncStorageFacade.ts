import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageFacade } from './StorageFacade';

export const AsyncStorageFacade: StorageFacade = {
  async get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

