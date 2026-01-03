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

interface VacationRequestDB {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  collaborator_notes?: string;
  manager_notes?: string;
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_avatar?: string;
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
  
  // Como a tabela não tem chave primária, primeiro deleta todos os registros e depois insere
  // Isso garante que sempre temos apenas um registro com os dados mais atualizados
  await db.runAsync('DELETE FROM admin_reports', []);
  
  await db.runAsync(
    `INSERT INTO admin_reports (
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
  
  console.log('[AdminLocalDataSource] Reports saved to local database');
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
  
  // Usar INSERT OR REPLACE para preservar dados locais que podem ter sido atualizados offline
  // Não deletar tudo para não perder aprovações locais ainda não sincronizadas
  for (const user of users) {
    await db.runAsync(
      `INSERT OR REPLACE INTO admin_users (id, name, email, role, status, created_at, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.role, user.status, user.createdAt, user.avatarUrl || null]
    );
  }
};

// Função para aprovar usuário localmente (optimistic update)
export const approveUserLocal = async (userId: string): Promise<User | null> => {
  const db = await getDatabase();
  
  // 1. Buscar o usuário pendente
  const pendingResult = await db.getAllAsync<PendingUserDB>(
    'SELECT * FROM admin_pending_users WHERE id = ?',
    [userId]
  );
  
  if (pendingResult.length === 0) {
    console.warn('[AdminLocalDataSource] Pending user not found:', userId);
    return null;
  }
  
  const pendingUser = pendingResult[0];
  const now = new Date().toISOString();
  
  // 2. Criar o usuário ativo a partir do pendente
  const activeUser: User = {
    id: pendingUser.id,
    name: pendingUser.name,
    email: pendingUser.email,
    role: pendingUser.role as 'Colaborador' | 'Gestor' | 'Administrador',
    status: 'active',
    createdAt: pendingUser.created_at,
  };
  
  // 3. Remover do admin_pending_users
  await db.runAsync('DELETE FROM admin_pending_users WHERE id = ?', [userId]);
  
  // 4. Adicionar/atualizar no admin_users
  await db.runAsync(
    `INSERT OR REPLACE INTO admin_users (id, name, email, role, status, created_at, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [activeUser.id, activeUser.name, activeUser.email, activeUser.role, activeUser.status, activeUser.createdAt, null]
  );
  
  console.log('[AdminLocalDataSource] User approved locally:', userId);
  return activeUser;
};

// Função para rejeitar usuário localmente (apenas remove do pendente)
export const rejectUserLocal = async (userId: string): Promise<void> => {
  const db = await getDatabase();
  
  // Remove do admin_pending_users
  await db.runAsync('DELETE FROM admin_pending_users WHERE id = ?', [userId]);
  
  console.log('[AdminLocalDataSource] User rejected locally:', userId);
};

// Função para atualizar status do usuário localmente (optimistic update)
export const updateUserStatusLocal = async (userId: string, status: 'active' | 'inactive'): Promise<void> => {
  const db = await getDatabase();
  
  // Atualiza o status no admin_users
  await db.runAsync(
    'UPDATE admin_users SET status = ? WHERE id = ?',
    [status, userId]
  );
  
  console.log('[AdminLocalDataSource] User status updated locally:', userId, status);
};

// Função para recalcular reports a partir dos dados locais (chamada após ações offline)
export const recalculateReportsFromLocal = async (): Promise<AdminReports> => {
  const db = await getDatabase();
  
  // 1. Buscar solicitações do local
  const requests = await db.getAllAsync<VacationRequestDB>(
    'SELECT id, status, created_at, updated_at FROM vacation_requests ORDER BY created_at DESC',
    []
  );
  
  // 2. Buscar usuários do local
  const users = await db.getAllAsync<UserDB>(
    'SELECT id, role, status, created_at FROM admin_users',
    []
  );
  
  // 3. Buscar usuários pendentes do local
  const pendingUsers = await db.getAllAsync<PendingUserDB>(
    'SELECT id, role, created_at FROM admin_pending_users',
    []
  );
  
  // 4. Calcular estatísticas de solicitações
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
  
  const requestsThisMonth = requests.filter(r => {
    const requestDate = new Date(r.created_at);
    return requestDate >= monthStart;
  });
  const newRequestsThisMonth = requestsThisMonth.length;
  const approvedRequestsThisMonth = requestsThisMonth.filter(r => r.status === 'approved').length;
  
  // 5. Calcular estatísticas de usuários
  const totalCollaborators = users.filter(u => u.role === 'Colaborador').length;
  const totalManagers = users.filter(u => u.role === 'Gestor').length;
  const activeCollaborators = users.filter(u => u.role === 'Colaborador' && u.status === 'active').length;
  const pendingRegistrations = pendingUsers.length;
  
  // 6. Calcular novos cadastros deste mês (usuários + pendentes criados este mês)
  const allUsersThisMonth = [...users, ...pendingUsers].filter(u => {
    const userDate = new Date(u.created_at);
    return userDate >= monthStart;
  });
  const newRegistrationsThisMonth = allUsersThisMonth.length;
  
  const reports: AdminReports = {
    totalRequests,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
    totalCollaborators,
    totalManagers,
    activeCollaborators,
    pendingRegistrations,
    newRequestsThisMonth,
    approvedRequestsThisMonth,
    newRegistrationsThisMonth,
  };
  
  // 7. Salvar os reports recalculados no banco local
  await saveReportsLocal(reports);
  
  console.log('[AdminLocalDataSource] Reports recalculated from local data:', reports);
  
  return reports;
};

// Função para sincronizar solicitações do remoto para o local (similar ao manager)
export const syncRequestsFromRemote = async (requests: Array<{
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  collaborator_notes?: string;
  manager_notes?: string;
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_avatar?: string;
}>): Promise<void> => {
  const db = await getDatabase();
  
  for (const req of requests) {
    // Verifica se já existe e compara updatedAt para não sobrescrever mudanças locais mais recentes
    const existing = await db.getAllAsync<VacationRequestDB>(
      'SELECT updated_at FROM vacation_requests WHERE id = ?',
      [req.id]
    );

    let shouldUpdate = true;
    if (existing.length > 0) {
      const localUpdated = new Date(existing[0].updated_at).getTime();
      const remoteUpdated = new Date(req.updated_at || req.created_at).getTime();
      
      // Se local é mais novo (ex: mudança pendente de sync), não sobrescrever
      if (localUpdated > remoteUpdated) {
        shouldUpdate = false;
      }
    }

    if (shouldUpdate) {
      await db.runAsync(
        `INSERT OR REPLACE INTO vacation_requests (
          id, user_id, title, start_date, end_date, status,
          collaborator_notes, manager_notes, created_at, updated_at,
          requester_name, requester_avatar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.id,
          req.user_id,
          req.title,
          req.start_date,
          req.end_date,
          req.status,
          req.collaborator_notes || '',
          req.manager_notes || '',
          req.created_at,
          req.updated_at || req.created_at,
          req.requester_name || null,
          req.requester_avatar || null,
        ]
      );
    }
  }
};
