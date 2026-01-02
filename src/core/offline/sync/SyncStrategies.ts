import { createVacationStrategy } from '../../../features/collaborator/data/strategies/CreateVacationStrategy';

export type SyncStrategy<T = unknown> = (payload: T) => Promise<void>;

const strategies = new Map<string, SyncStrategy>();

// Register default strategies
strategies.set('CREATE_VACATION_REQUEST', createVacationStrategy);

export const SyncStrategies = {
  register: (type: string, strategy: SyncStrategy) => {
    strategies.set(type, strategy);
  },

  get: (type: string): SyncStrategy | undefined => {
    return strategies.get(type);
  }
};
