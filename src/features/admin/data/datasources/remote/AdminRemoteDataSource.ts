import { supabase } from '../../../../../core/services/supabase';
import { AdminReports } from '../../../domain/entities/AdminReports';
import { PendingUser } from '../../../domain/entities/PendingUser';
import { User } from '../../../domain/entities/User';

// Helper para calcular estatísticas do mês atual
const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
};

export const getRequestsRemoteForSync = async (): Promise<Array<{
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
}> | null> => {
  console.log('[AdminRemoteDataSource] Fetching requests for sync...');
  
  // Tentar buscar todas as solicitações do remoto para sincronizar
  try {
    const { data: requests, error: requestsError } = await supabase
      .from('vacation_requests')
      .select('id, user_id, title, start_date, end_date, status, collaborator_notes, manager_notes, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (requestsError) {
      console.warn('[AdminRemoteDataSource] Error fetching requests for sync (RLS may block):', requestsError.message);
      return null; // Retorna null se não conseguir buscar (RLS)
    }
    
    console.log('[AdminRemoteDataSource] Requests fetched for sync:', requests?.length || 0);
    return requests || null;
  } catch (error) {
    console.warn('[AdminRemoteDataSource] Exception fetching requests for sync:', error);
    return null;
  }
};

export const getReportsRemote = async (): Promise<AdminReports> => {
  console.log('[AdminRemoteDataSource] Fetching reports...');
  
  // Verificar sessão do usuário para debug
  const { data: { user } } = await supabase.auth.getUser();
  console.log('[AdminRemoteDataSource] Current user:', user?.id, user?.email);
  
  // Primeiro, tentar contar o total de solicitações para verificar RLS
  const { count: totalCount, error: countError } = await supabase
    .from('vacation_requests')
    .select('*', { count: 'exact', head: true });
  
  console.log('[AdminRemoteDataSource] Total vacation_requests count:', totalCount, 'Error:', countError?.message);
  
  // Buscar todas as solicitações (sem join para evitar problemas de RLS)
  const { data: requests, error: requestsError } = await supabase
    .from('vacation_requests')
    .select('status, created_at')
    .order('created_at', { ascending: false });
  
  console.log('[AdminRemoteDataSource] Requests fetched:', requests?.length || 0);
  if (requests && requests.length > 0) {
    console.log('[AdminRemoteDataSource] Sample request statuses:', {
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      total: requests.length
    });
  }
  
  if (requestsError) {
    console.error('[AdminRemoteDataSource] Error fetching requests:', requestsError);
    throw requestsError;
  }

  // Buscar todos os perfis
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('role, status, created_at');
  
  console.log('[AdminRemoteDataSource] Profiles fetched:', profiles?.length || 0);
  
  if (profilesError) {
    console.error('[AdminRemoteDataSource] Error fetching profiles:', profilesError);
    throw profilesError;
  }

  const monthStart = getCurrentMonthStart();
  console.log('[AdminRemoteDataSource] Month start:', monthStart);
  
  // Calcular estatísticas de solicitações
  const totalRequests = requests?.length || 0;
  const approvedRequests = requests?.filter(r => r.status === 'approved').length || 0;
  const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;
  const rejectedRequests = requests?.filter(r => r.status === 'rejected').length || 0;
  
  // Solicitações deste mês
  const requestsThisMonth = requests?.filter(r => {
    const requestDate = new Date(r.created_at);
    const monthStartDate = new Date(monthStart);
    return requestDate >= monthStartDate;
  }) || [];
  const newRequestsThisMonth = requestsThisMonth.length;
  const approvedRequestsThisMonth = requestsThisMonth.filter(r => r.status === 'approved').length;

  // Calcular estatísticas de usuários
  const totalCollaborators = profiles?.filter(p => p.role === 'Colaborador').length || 0;
  const totalManagers = profiles?.filter(p => p.role === 'Gestor').length || 0;
  const activeCollaborators = profiles?.filter(p => p.role === 'Colaborador' && p.status === 'active').length || 0;
  const pendingRegistrations = profiles?.filter(p => p.status === 'pending').length || 0;
  
  // Cadastros deste mês
  const profilesThisMonth = profiles?.filter(p => {
    const profileDate = new Date(p.created_at);
    const monthStartDate = new Date(monthStart);
    return profileDate >= monthStartDate;
  }) || [];
  const newRegistrationsThisMonth = profilesThisMonth.length;

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

  console.log('[AdminRemoteDataSource] Final reports:', JSON.stringify(reports, null, 2));

  return reports;
};

export const getPendingUsersRemote = async (): Promise<PendingUser[]> => {
  console.log('[AdminRemoteDataSource] Fetching pending users...');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminRemoteDataSource] Error fetching pending users:', error);
    throw error;
  }

  return (data || []).map(profile => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    status: 'pending' as const,
    createdAt: profile.created_at,
  }));
};

export const getUsersRemote = async (filter?: string): Promise<User[]> => {
  console.log('[AdminRemoteDataSource] Fetching users...');
  
  let query = supabase
    .from('profiles')
    .select('id, name, email, role, status, created_at, avatar_url')
    .eq('status', 'active'); // Apenas usuários ativos

  // Aplicar filtro de role se fornecido
  if (filter && filter !== 'Todos') {
    const roleMap: Record<string, string> = {
      'Colaboradores': 'Colaborador',
      'Gestores': 'Gestor',
      'Adm': 'Administrador',
    };
    const roleFilter = roleMap[filter];
    if (roleFilter) {
      query = query.eq('role', roleFilter);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminRemoteDataSource] Error fetching users:', error);
    throw error;
  }

  return (data || []).map(profile => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as 'Colaborador' | 'Gestor' | 'Administrador',
    status: profile.status as 'active' | 'pending' | 'inactive',
    createdAt: profile.created_at,
    avatarUrl: profile.avatar_url,
  }));
};

export const approveUserRemote = async (userId: string): Promise<void> => {
  console.log('[AdminRemoteDataSource] Approving user:', userId);
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('[AdminRemoteDataSource] Error approving user:', error);
    throw error;
  }
};

export const rejectUserRemote = async (userId: string): Promise<void> => {
  console.log('[AdminRemoteDataSource] Rejecting user:', userId);
  
  // Rejeitar significa remover o perfil ou marcar como inativo
  // Por enquanto vamos apenas remover o perfil
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('[AdminRemoteDataSource] Error rejecting user:', error);
    throw error;
  }
};

export const updateUserStatusRemote = async (userId: string, status: 'active' | 'inactive'): Promise<void> => {
  console.log('[AdminRemoteDataSource] Updating user status:', userId, status);
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('[AdminRemoteDataSource] Error updating user status:', error);
    throw error;
  }
};

