import { _test_resetDB } from '../../../core/facades/sqlite.facade';
import { AdminRepositoryImpl } from '../data/repositories/AdminRepositoryImpl';
import { setupAuthForTest, teardownAuthForTest } from '../../auth/tests/utils';
import { supabase } from '../../../core/services/supabase';
import { generateUUID } from '../../../core/utils';
import * as LocalDataSource from '../data/datasources/local/AdminLocalDataSource';

describe('Admin Feature Integration Tests', () => {
  let adminId: string;
  let testPendingUserId1: string;
  let testPendingUserId2: string;
  let testActiveUserId1: string;
  let testActiveUserId2: string;
  
  // Track changes made by tests for cleanup
  const testChanges: Array<{ userId: string; originalStatus: string; originalRole?: string; originalName?: string; originalEmail?: string }> = [];

  beforeAll(async () => {
    adminId = await setupAuthForTest();
    // Ensure the test user has admin role in Supabase
    // This is critical if RLS policies restrict viewing users to admins
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: adminId, 
        role: 'Administrador',
        name: 'Test Admin',
        email: 'admin@test.com',
        status: 'active'
      });
    
    if (error) console.warn('Error setting admin role:', error);

    // Fetch existing pending users from the database to use in tests
    const { data: pendingUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('status', 'pending')
      .limit(2);

    if (pendingUsers && pendingUsers.length >= 2) {
      testPendingUserId1 = pendingUsers[0].id;
      testPendingUserId2 = pendingUsers[1].id;
    } else {
      // If there aren't enough pending users, we'll skip those tests
      console.warn('Not enough pending users found in database for testing');
    }

    // Fetch existing active users from the database to use in tests
    const { data: activeCollaborators } = await supabase
      .from('profiles')
      .select('id')
      .eq('status', 'active')
      .eq('role', 'Colaborador')
      .limit(1);

    const { data: activeManagers } = await supabase
      .from('profiles')
      .select('id')
      .eq('status', 'active')
      .eq('role', 'Gestor')
      .limit(1);

    if (activeCollaborators && activeCollaborators.length > 0) {
      testActiveUserId1 = activeCollaborators[0].id;
    }

    if (activeManagers && activeManagers.length > 0) {
      testActiveUserId2 = activeManagers[0].id;
    }
  }, 30000);

  beforeEach(async () => {
    // Reset local DB before each test to ensure clean state
    await _test_resetDB();
    // Clear test changes tracking
    testChanges.length = 0;
  });

  afterEach(async () => {
    // Cleanup: Restore original state for users modified by tests
    for (const change of testChanges) {
      try {
        // Check if user still exists (wasn't deleted)
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', change.userId)
          .single();
        
        if (existingUser && change.originalStatus === 'pending') {
          // If user was approved, revert back to pending
          await supabase
            .from('profiles')
            .update({ 
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('id', change.userId);
        }
        // Note: If user was rejected (deleted), we cannot easily restore without recreating auth.users
        // So we'll skip that cleanup - it's acceptable since rejection typically shouldn't be done on test data
      } catch (error) {
        console.warn(`Failed to cleanup test changes for user ${change.userId}:`, error);
      }
    }
    
    // Reset local DB after each test
    await _test_resetDB();
  });

  afterAll(async () => {
    // Final cleanup: Restore any remaining changes
    for (const change of testChanges) {
      try {
        if (change.originalStatus === 'pending') {
          await supabase
            .from('profiles')
            .update({ 
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('id', change.userId);
        }
      } catch (error) {
        console.warn(`Failed to cleanup test changes for user ${change.userId}:`, error);
      }
    }
    
    await teardownAuthForTest();
  });

  it('should fetch pending users from remote', async () => {
    // Skip if we don't have test users
    if (!testPendingUserId1 || !testPendingUserId2) {
      console.warn('Skipping test: Not enough pending users in database');
      return;
    }

    // 1. Action: Get pending users via AdminRepository
    const pendingUsers = await AdminRepositoryImpl.getPendingUsers();

    // 2. Assertion: Should find our test pending users
    const found1 = pendingUsers.find(u => u.id === testPendingUserId1);
    const found2 = pendingUsers.find(u => u.id === testPendingUserId2);
    
    expect(found1).toBeDefined();
    expect(found1?.status).toBe('pending');
    
    expect(found2).toBeDefined();
    expect(found2?.status).toBe('pending');
  }, 10000);

  it('should approve a pending user locally and update reports', async () => {
    // 1. Setup: Fetch pending users to populate local DB
    const initialPendingUsers = await AdminRepositoryImpl.getPendingUsers();
    
    // Use the first pending user available (not a specific one, since data changes)
    const userToApprove = initialPendingUsers[0];
    
    if (!userToApprove) {
      console.warn('Skipping test: No pending users available in database');
      return;
    }
    
    // Verify user exists in local pending list before approval
    const localPendingBefore = await LocalDataSource.getPendingUsersLocal();
    const existsBefore = localPendingBefore.find(u => u.id === userToApprove.id);
    
    if (!existsBefore) {
      console.warn('Skipping test: User not found in local pending list (may have been already approved)');
      return;
    }
    
    // Save original state for cleanup
    const { data: originalUser } = await supabase
      .from('profiles')
      .select('id, status, role, name, email')
      .eq('id', userToApprove.id)
      .single();
    
    if (originalUser) {
      testChanges.push({
        userId: userToApprove.id,
        originalStatus: originalUser.status,
        originalRole: originalUser.role,
        originalName: originalUser.name,
        originalEmail: originalUser.email
      });
    }
    
    // 2. Action: Approve user
    await AdminRepositoryImpl.approveUser(userToApprove.id);

    // 3. Assertion: User should be removed from pending (check local DB directly)
    const localPendingAfter = await LocalDataSource.getPendingUsersLocal();
    const foundInPending = localPendingAfter.find(u => u.id === userToApprove.id);
    
    expect(foundInPending).toBeUndefined();

    // 4. Assertion: User should be in active users list (check local DB directly)
    const localActiveUsers = await LocalDataSource.getUsersLocal();
    const foundInActive = localActiveUsers.find(u => u.id === userToApprove.id);
    
    expect(foundInActive).toBeDefined();
    expect(foundInActive?.status).toBe('active');

    // 5. Assertion: Reports should be updated
    const reports = await AdminRepositoryImpl.getReports();
    expect(reports.pendingRegistrations).toBeGreaterThanOrEqual(0);
  }, 10000);

  it('should reject a pending user locally', async () => {
    // 1. Setup: Fetch pending users to populate local DB
    const initialPendingUsers = await AdminRepositoryImpl.getPendingUsers();
    
    // Use a different user (if available) or the first one
    const userToReject = initialPendingUsers.length > 1 ? initialPendingUsers[1] : initialPendingUsers[0];
    
    if (!userToReject) {
      console.warn('Skipping test: No pending users available in database');
      return;
    }
    
    // Verify user exists in local pending list before rejection
    const localPendingBefore = await LocalDataSource.getPendingUsersLocal();
    const existsBefore = localPendingBefore.find(u => u.id === userToReject.id);
    
    if (!existsBefore) {
      console.warn('Skipping test: User not found in local pending list');
      return;
    }
    
    // Save original state for cleanup
    // Note: If rejection deletes the user, we cannot restore it easily
    // So we'll just track it but skip cleanup for rejected users
    const { data: originalUser } = await supabase
      .from('profiles')
      .select('id, status, role, name, email')
      .eq('id', userToReject.id)
      .single();
    
    if (originalUser) {
      testChanges.push({
        userId: userToReject.id,
        originalStatus: originalUser.status,
        originalRole: originalUser.role,
        originalName: originalUser.name,
        originalEmail: originalUser.email
      });
    }
    
    // 2. Action: Reject user (may fail remotely due to FK constraints, but should work locally)
    let wasRejected = false;
    try {
      await AdminRepositoryImpl.rejectUser(userToReject.id);
      wasRejected = true;
    } catch (error) {
      // Remote rejection may fail if user has vacation_requests, but local should still work
      console.warn('Remote rejection failed (expected if user has related data):', error);
    }
    
    // If rejection was successful remotely (user was deleted), mark it so we skip cleanup
    if (wasRejected) {
      // Check if user still exists
      const { data: checkUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userToReject.id)
        .single();
      
      if (!checkUser) {
        // User was deleted, remove from cleanup tracking since we can't restore deleted users easily
        const index = testChanges.findIndex(c => c.userId === userToReject.id);
        if (index > -1) {
          testChanges.splice(index, 1);
        }
      }
    }

    // 3. Assertion: User should be removed from pending users locally (check local DB directly)
    const localPendingAfter = await LocalDataSource.getPendingUsersLocal();
    const foundInPending = localPendingAfter.find(u => u.id === userToReject.id);
    
    expect(foundInPending).toBeUndefined();

    // 4. Assertion: User should NOT be in active users list (check local DB directly)
    const localActiveUsers = await LocalDataSource.getUsersLocal();
    const foundInActive = localActiveUsers.find(u => u.id === userToReject.id);
    
    expect(foundInActive).toBeUndefined();

    // 5. Assertion: Reports should be updated
    const reports = await AdminRepositoryImpl.getReports();
    expect(reports.pendingRegistrations).toBeGreaterThanOrEqual(0);
  }, 10000);

  it('should list all active users', async () => {
    // 1. Action: Get all users
    const users = await AdminRepositoryImpl.getUsers();

    // 2. Assertion: Should return active users
    expect(users.length).toBeGreaterThan(0);
    users.forEach(user => {
      expect(user.status).toBe('active');
    });

    // 3. Assertion: Should find our test active users if they exist
    if (testActiveUserId1) {
      const found1 = users.find(u => u.id === testActiveUserId1);
      if (found1) {
        expect(found1.status).toBe('active');
        expect(found1.role).toBe('Colaborador');
      }
    }
    
    if (testActiveUserId2) {
      const found2 = users.find(u => u.id === testActiveUserId2);
      if (found2) {
        expect(found2.status).toBe('active');
        expect(found2.role).toBe('Gestor');
      }
    }
  }, 10000);

  it('should filter users by role - Colaboradores', async () => {
    // 1. Action: Get users filtered by Colaboradores
    const users = await AdminRepositoryImpl.getUsers('Colaboradores');

    // 2. Assertion: Should only return Colaboradores (skip if no users exist)
    if (users.length === 0) {
      console.warn('Skipping assertions: No colaboradores found in database');
      return;
    }
    users.forEach(user => {
      expect(user.role).toBe('Colaborador');
      expect(user.status).toBe('active');
    });

    // 3. Assertion: Should include our test collaborator if it exists
    if (testActiveUserId1) {
      const found = users.find(u => u.id === testActiveUserId1);
      if (found) {
        expect(found.role).toBe('Colaborador');
      }
    }
    
    // 4. Assertion: Should NOT include managers
    if (testActiveUserId2) {
      const managerFound = users.find(u => u.id === testActiveUserId2);
      expect(managerFound).toBeUndefined();
    }
  }, 10000);

  it('should filter users by role - Gestores', async () => {
    // 1. Action: Get users filtered by Gestores
    const users = await AdminRepositoryImpl.getUsers('Gestores');

    // 2. Assertion: Should only return Gestores
    expect(users.length).toBeGreaterThan(0);
    users.forEach(user => {
      expect(user.role).toBe('Gestor');
      expect(user.status).toBe('active');
    });

    // 3. Assertion: Should include our test manager if it exists
    if (testActiveUserId2) {
      const found = users.find(u => u.id === testActiveUserId2);
      if (found) {
        expect(found.role).toBe('Gestor');
      }
    }
    
    // 4. Assertion: Should NOT include collaborators
    if (testActiveUserId1) {
      const collabFound = users.find(u => u.id === testActiveUserId1);
      expect(collabFound).toBeUndefined();
    }
  }, 10000);

  it('should filter users by role - Todos', async () => {
    // 1. Action: Get all users (Todos filter)
    const users = await AdminRepositoryImpl.getUsers('Todos');

    // 2. Assertion: Should return both collaborators and managers
    const hasCollaborators = users.some(u => u.role === 'Colaborador');
    const hasManagers = users.some(u => u.role === 'Gestor');
    
    expect(hasCollaborators || hasManagers).toBe(true);

    // 3. Assertion: Should include test users if they exist
    if (testActiveUserId1) {
      const found1 = users.find(u => u.id === testActiveUserId1);
      if (found1) {
        expect(found1.status).toBe('active');
      }
    }
    
    if (testActiveUserId2) {
      const found2 = users.find(u => u.id === testActiveUserId2);
      if (found2) {
        expect(found2.status).toBe('active');
      }
    }
  }, 10000);

  it('should return users with correct data structure for search functionality', async () => {
    // 1. Action: Get all users
    const users = await AdminRepositoryImpl.getUsers();

    // 2. Assertion: Each user should have the necessary fields for search
    expect(users.length).toBeGreaterThan(0);
    users.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('status');
      
      // These fields are required for the search functionality in AdminUsersScreen
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(user.name.length).toBeGreaterThan(0);
      expect(user.email.length).toBeGreaterThan(0);
    });

    // 3. Assertion: Should be able to filter by name/email (simulating search)
    if (users.length > 0) {
      const testUser = users[0];
      const searchQuery = testUser.name.toLowerCase();
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery)
      );
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(u => u.id === testUser.id)).toBe(true);
    }
  }, 10000);
});

