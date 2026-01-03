import { _test_resetDB } from '../../../core/facades/sqlite.facade';
import { VacationRepositoryImpl } from '../data/repositories/VacationRepositoryImpl';
import { createRequestRemote } from '../data/datasources/remote/VacationRemoteDatasource';
import { VacationRequest } from '../domain/entities/VacationRequest';
import { generateUUID } from '../../../core/utils';
import { setupAuthForTest, teardownAuthForTest } from '../../auth/tests/utils';
import { supabase } from '../../../core/services/supabase';

describe('Collaborator Feature Integration Tests (Real)', () => {
  let userId: string;
  
  // Track changes made by tests for cleanup
  const testRequests: Array<{ requestId: string }> = [];

  beforeAll(async () => {
    userId = await setupAuthForTest();
  }, 10000);

  beforeEach(async () => {
    // Reset local DB before each test to ensure clean state
    await _test_resetDB();
    // Clear test requests tracking
    testRequests.length = 0;
  });

  afterEach(async () => {
    // Cleanup: Delete test requests created by tests
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

  it('should fetch requests from remote when local is empty', async () => {
    // 1. Setup: Create a request directly on remote (simulating existing data)
    const remoteRequest: Partial<VacationRequest> = {
      id: generateUUID(),
      userId: userId,
      title: 'Integration Test Remote',
      startDate: '01/01/2025',
      endDate: '10/01/2025',
      collaboratorNotes: 'Created via integration test remote',
      status: 'pending'
    };

    // Track for cleanup
    if (remoteRequest.id) {
      testRequests.push({ requestId: remoteRequest.id });
    }

    try {
      await createRequestRemote(remoteRequest);

      // 2. Action: Get requests via Repository
      // Since local DB is reset in beforeEach, this should trigger remote fetch
      const requests = await VacationRepositoryImpl.getRequests(userId);

      // 3. Assertion: Should find the remote request
      const found = requests.find(r => r.title === remoteRequest.title);
      expect(found).toBeDefined();
      expect(found?.collaboratorNotes).toBe(remoteRequest.collaboratorNotes);
      
    } catch (error) {
      console.error('Remote fetch test failed:', error);
      throw error;
    }
  });

  it('should insert request locally (offline-first) and retrieve it', async () => {
    // 1. Setup: Define new request
    const localRequest: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'> = {
      userId: userId,
      title: 'Integration Test Local',
      startDate: '15/02/2025',
      endDate: '20/02/2025',
      collaboratorNotes: 'Created via integration test local'
    };

    // 2. Action: Create request via Repository
    await VacationRepositoryImpl.createRequest(localRequest);

    // 3. Action: Get requests
    const requests = await VacationRepositoryImpl.getRequests(userId);

    // 4. Assertion: Should find the local request
    const found = requests.find(r => r.title === localRequest.title);
    expect(found).toBeDefined();
    expect(found?.collaboratorNotes).toBe(localRequest.collaboratorNotes);
    expect(found?.status).toBe('pending'); // Default status
    
    // Track for cleanup (if it was created remotely)
    if (found?.id) {
      // Check if it exists remotely (was synced)
      const { data: remoteCheck } = await supabase
        .from('vacation_requests')
        .select('id')
        .eq('id', found.id)
        .single();
      
      if (remoteCheck) {
        testRequests.push({ requestId: found.id });
      }
    }
  });
});
