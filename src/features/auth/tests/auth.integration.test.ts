import { useAuthStore } from '../presentation/store/useAuthStore';
import { _test_resetDB } from '../../../core/facades/sqlite.facade';

// Note: This test requires valid Supabase credentials and a corresponding user profile in the 'users' table.
const TEST_EMAIL = 'colaborador@onvacation.com';
const TEST_PASSWORD = '123456'; // PLEASE UPDATE THIS WITH A VALID PASSWORD

describe('Auth Integration Tests (Real)', () => {
  beforeEach(async () => {
    // Reset store state
    useAuthStore.setState({ user: null, isLoading: false, isInitialized: false });
    // Reset local DB (Fake implementation)
    await _test_resetDB();
  });

  it('should login with real credentials and persist session', async () => {
    try {
      // Action: Login
      await useAuthStore.getState().signIn(TEST_EMAIL, TEST_PASSWORD);
      
      // Assertions: Store updated
      const user = useAuthStore.getState().user;
      expect(user).not.toBeNull();
      expect(user?.email).toBe(TEST_EMAIL);
      
      // Verify Persistence:
      // Clear store to simulate app restart
      useAuthStore.setState({ user: null, isLoading: false, isInitialized: false });
      
      // Restore session
      await useAuthStore.getState().checkAuth();
      
      // Assertions: Session restored
      expect(useAuthStore.getState().user).toEqual(user);
      expect(useAuthStore.getState().isInitialized).toBe(true);

      // Cleanup: Logout
      await useAuthStore.getState().signOut();
      expect(useAuthStore.getState().user).toBeNull();

      // Verify Session Cleared
      useAuthStore.setState({ user: null, isLoading: false, isInitialized: false });
      await useAuthStore.getState().checkAuth();
      expect(useAuthStore.getState().user).toBeNull();

    } catch (error) {
      console.warn('Test failed. If this is an authentication error, please ensure TEST_EMAIL and TEST_PASSWORD are valid in auth.integration.test.ts');
      // We re-throw to fail the test, as requested.
      throw error;
    }
  }, 10000); // Increase timeout for network requests
});
