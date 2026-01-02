export type SyncStrategy<T = any> = (payload: T) => Promise<void>;

const strategies = new Map<string, SyncStrategy>();

export const SyncStrategies = {
  register: (type: string, strategy: SyncStrategy) => {
    strategies.set(type, strategy);
  },

  get: (type: string): SyncStrategy | undefined => {
    return strategies.get(type);
  }
};
