import { useAuthStore } from '../presentation/store/useAuthStore';
import { runMigrations } from '../../../core/offline/database/migrations';

export const TEST_EMAIL = 'colaborador@onvacation.com';
export const TEST_PASSWORD = '123456';

export const setupAuthForTest = async () => {
  // 0. Ensure DB schema exists
  await runMigrations();

  // 1. Authenticate to get a valid user ID
  // Reset store state
  useAuthStore.setState({ user: null, isLoading: false, isInitialized: false });

  // Login
  await useAuthStore.getState().signIn(TEST_EMAIL, TEST_PASSWORD);
  const user = useAuthStore.getState().user;

  if (!user) {
    throw new Error('Failed to login for test setup');
  }
  
  return user.id;
};

export const teardownAuthForTest = async () => {
  // Cleanup: Logout
  await useAuthStore.getState().signOut();
};
