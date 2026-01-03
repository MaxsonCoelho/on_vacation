import { getDatabase } from '../../../../../core/offline/database/connection';
import { AdminReports } from '../../../domain/entities/AdminReports';
import { PendingUser } from '../../../domain/entities/PendingUser';
import { User } from '../../../domain/entities/User';

interface AdminReportsDB {
  total_requests: number;
  approved_requests: number;
  pending_requests: number;
  rejected_requests: number;
  total_collaborators: number;
  total_managers: number;
  active_collaborators: number;
  pending_registrations: number;
  new_requests_this_month: number;
  approved_requests_this_month: number;
  new_registrations_this_month: number;
}

interface PendingUserDB {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface UserDB {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  avatar_url?: string;
}

export const getReportsLocal = async (): Promise<AdminReports | null> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<AdminReportsDB>(
    'SELECT * FROM admin_reports LIMIT 1',
    []
  );

  if (result.length === 0) return null;

  const row = result[0];
  return {
    totalRequests: row.total_requests,
    approvedRequests: row.approved_requests,
    pendingRequests: row.pending_requests,
    rejectedRequests: row.rejected_requests,
    totalCollaborators: row.total_collaborators,
    totalManagers: row.total_managers,
    activeCollaborators: row.active_collaborators,
    pendingRegistrations: row.pending_registrations,
    newRequestsThisMonth: row.new_requests_this_month,
    approvedRequestsThisMonth: row.approved_requests_this_month,
    newRegistrationsThisMonth: row.new_registrations_this_month,
  };
};

export const saveReportsLocal = async (reports: AdminReports): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO admin_reports (
      total_requests, approved_requests, pending_requests, rejected_requests,
      total_collaborators, total_managers, active_collaborators, pending_registrations,
      new_requests_this_month, approved_requests_this_month, new_registrations_this_month
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reports.totalRequests,
      reports.approvedRequests,
      reports.pendingRequests,
      reports.rejectedRequests,
      reports.totalCollaborators,
      reports.totalManagers,
      reports.activeCollaborators,
      reports.pendingRegistrations,
      reports.newRequestsThisMonth,
      reports.approvedRequestsThisMonth,
      reports.newRegistrationsThisMonth,
    ]
  );
};

export const getPendingUsersLocal = async (): Promise<PendingUser[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<PendingUserDB>(
    'SELECT * FROM admin_pending_users ORDER BY created_at DESC',
    []
  );

  return result.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: 'pending' as const,
    createdAt: row.created_at,
  }));
};

export const savePendingUsersLocal = async (users: PendingUser[]): Promise<void> => {
  const db = await getDatabase();
  
  // Limpar dados antigos
  await db.runAsync('DELETE FROM admin_pending_users', []);
  
  // Inserir novos dados
  for (const user of users) {
    await db.runAsync(
      `INSERT INTO admin_pending_users (id, name, email, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.role, user.status, user.createdAt]
    );
  }
};

export const getUsersLocal = async (filter?: string): Promise<User[]> => {
  const db = await getDatabase();
  
  let query = 'SELECT * FROM admin_users WHERE status = ? ORDER BY created_at DESC';
  const params: any[] = ['active'];
  
  if (filter && filter !== 'Todos') {
    const roleMap: Record<string, string> = {
      'Colaboradores': 'Colaborador',
      'Gestores': 'Gestor',
      'Adm': 'Administrador',
    };
    const roleFilter = roleMap[filter];
    if (roleFilter) {
      query = 'SELECT * FROM admin_users WHERE status = ? AND role = ? ORDER BY created_at DESC';
      params.push(roleFilter);
    }
  }
  
  const result = await db.getAllAsync<UserDB>(query, params);

  return result.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as 'Colaborador' | 'Gestor' | 'Administrador',
    status: row.status as 'active' | 'pending' | 'inactive',
    createdAt: row.created_at,
    avatarUrl: row.avatar_url,
  }));
};

export const saveUsersLocal = async (users: User[]): Promise<void> => {
  const db = await getDatabase();
  
  // Limpar dados antigos
  await db.runAsync('DELETE FROM admin_users', []);
  
  // Inserir novos dados
  for (const user of users) {
    await db.runAsync(
      `INSERT INTO admin_users (id, name, email, role, status, created_at, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.role, user.status, user.createdAt, user.avatarUrl || null]
    );
  }
};

