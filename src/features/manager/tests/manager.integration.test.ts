import { _test_resetDB } from '../../../core/facades/sqlite.facade';
import { ManagerRepositoryImpl } from '../data/repositories/ManagerRepositoryImpl';
import { setupAuthForTest, teardownAuthForTest } from '../../auth/tests/utils';
import { supabase } from '../../../core/services/supabase';
import { generateUUID } from '../../../core/utils';

describe('Manager Feature Integration Tests', () => {
  let managerId: string;
  
  // Track changes made by tests for cleanup
  const testRequests: Array<{ requestId: string; originalStatus?: string }> = [];

  beforeAll(async () => {
    managerId = await setupAuthForTest();
    // Ensure the test user has manager role in Supabase
    // This is critical if RLS policies restrict viewing requests to managers
    const { error } = await supabase
        .from('profiles')
        .upsert({ 
            id: managerId, 
            role: 'manager',
            name: 'Test Manager',
            email: 'manager@test.com'
        });
    
    if (error) console.warn('Error setting manager role:', error);
  }, 30000);

  beforeEach(async () => {
    // Reset local DB before each test to ensure clean state
    await _test_resetDB();
    // Clear test requests tracking
    testRequests.length = 0;
  });

  afterEach(async () => {
    // Cleanup: Restore original state for requests modified by tests
    for (const testReq of testRequests) {
      try {
        // Check if request still exists
        const { data: existingRequest } = await supabase
          .from('vacation_requests')
          .select('id, status')
          .eq('id', testReq.requestId)
          .single();
        
        if (existingRequest) {
          // If we have original status, restore it; otherwise delete the test request
          if (testReq.originalStatus !== undefined) {
            await supabase
              .from('vacation_requests')
              .update({ 
                status: testReq.originalStatus,
                manager_notes: null,
                updated_at: new Date().toISOString()
              })
              .eq('id', testReq.requestId);
          } else {
            // Delete test request if it was created by the test
            await supabase
              .from('vacation_requests')
              .delete()
              .eq('id', testReq.requestId);
          }
        }
      } catch (error) {
        console.warn(`Failed to cleanup test request ${testReq.requestId}:`, error);
      }
    }
    
    // Reset local DB after each test
    await _test_resetDB();
  });

  afterAll(async () => {
    // Final cleanup: Delete any remaining test requests
    for (const testReq of testRequests) {
      try {
        await supabase
          .from('vacation_requests')
          .delete()
          .eq('id', testReq.requestId);
      } catch (error) {
        console.warn(`Failed to cleanup test request ${testReq.requestId}:`, error);
      }
    }
    
    await teardownAuthForTest();
  });

  const createRemoteRequest = async (title: string, status: string = 'pending') => {
      // Create a dummy user for the request if needed, or just use a random ID
      // For simplicity, we'll use the manager's ID as the requester too, 
      // or a random UUID if the FK constraint allows it (Supabase usually requires valid user_id)
      // Since we can't easily create another auth user, we'll use the current user as the "employee" 
      // but viewed through the "manager" lens.
      
      const requestId = generateUUID();
      const { error } = await supabase
          .from('vacation_requests')
          .insert({
              id: requestId,
              user_id: managerId, // Self-request for testing
              title: title,
              start_date: '2025-01-01',
              end_date: '2025-01-15',
              status: status,
              collaborator_notes: 'Integration test request'
          });
      
      if (error) throw error;
      return requestId;
  };

  it('should fetch requests from remote', async () => {
    // 1. Setup: Create a request on remote
    const title = `Manager Fetch Test ${Date.now()}`;
    const requestId = await createRemoteRequest(title);
    
    // Track for cleanup
    testRequests.push({ requestId });

    // 2. Action: Get requests via ManagerRepository
    const requests = await ManagerRepositoryImpl.getTeamRequests('Todas');

    // 3. Assertion: Should find the request
    const found = requests.find(r => r.title === title);
    expect(found).toBeDefined();
    expect(found?.title).toBe(title);
  });

  it('should approve a request locally and queue sync', async () => {
    // 1. Setup: Create and fetch a request
    const title = `Manager Approve Test ${Date.now()}`;
    const requestId = await createRemoteRequest(title);
    
    // Save original status for cleanup
    const { data: originalRequest } = await supabase
      .from('vacation_requests')
      .select('status')
      .eq('id', requestId)
      .single();
    
    testRequests.push({ 
      requestId, 
      originalStatus: originalRequest?.status || 'pending' 
    });
    
    // Initial fetch to populate local DB
    await ManagerRepositoryImpl.getTeamRequests();

    // 2. Action: Approve request
    await ManagerRepositoryImpl.approveRequest(requestId, 'Approved by integration test');

    // 3. Assertion: Local status should be approved
    const requests = await ManagerRepositoryImpl.getTeamRequests();
    const found = requests.find(r => r.id === requestId);
    
    expect(found).toBeDefined();
    expect(found?.status).toBe('approved');
    
    // Note: We are not testing the SyncWorker execution here, only that the Repository 
    // updates the local state correctly (Offline-First).
  }, 10000);

  it('should reject a request locally and queue sync', async () => {
    // 1. Setup: Create and fetch a request
    const title = `Manager Reject Test ${Date.now()}`;
    const requestId = await createRemoteRequest(title);
    
    // Save original status for cleanup
    const { data: originalRequest } = await supabase
      .from('vacation_requests')
      .select('status')
      .eq('id', requestId)
      .single();
    
    testRequests.push({ 
      requestId, 
      originalStatus: originalRequest?.status || 'pending' 
    });
    
    // Initial fetch to populate local DB
    await ManagerRepositoryImpl.getTeamRequests();

    // 2. Action: Reject request
    await ManagerRepositoryImpl.rejectRequest(requestId, 'Rejected by integration test');

    // 3. Assertion: Local status should be rejected
    const requests = await ManagerRepositoryImpl.getTeamRequests();
    const found = requests.find(r => r.id === requestId);
    
    expect(found).toBeDefined();
    expect(found?.status).toBe('rejected');
  }, 10000);
});
