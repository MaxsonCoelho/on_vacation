import { supabase } from '../../../../../core/services/supabase';
import { AdminReports } from '../../../domain/entities/AdminReports';
import { PendingUser } from '../../../domain/entities/PendingUser';
import { User } from '../../../domain/entities/User';
import { TeamRequest, RequestStatus } from '../../../manager/domain/entities/TeamRequest';

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
  // Tentar buscar todas as solicitações do remoto para sincronizar
  try {
    const { data: requests, error: requestsError } = await supabase
      .from('vacation_requests')
      .select('id, user_id, title, start_date, end_date, status, collaborator_notes, manager_notes, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (requestsError) {
      return null; // Retorna null se não conseguir buscar (RLS)
    }
    
    return requests || null;
  } catch (error) {
    return null;
  }
};

export const getReportsRemote = async (): Promise<AdminReports> => {
  // Buscar todas as solicitações (sem join para evitar problemas de RLS)
  const { data: requests, error: requestsError } = await supabase
    .from('vacation_requests')
    .select('status, created_at')
    .order('created_at', { ascending: false });
  
  if (requestsError) {
    console.error('[AdminRemoteDataSource] Error fetching requests:', requestsError);
    throw requestsError;
  }

  // Buscar todos os perfis
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('role, status, created_at');
  
  if (profilesError) {
    console.error('[AdminRemoteDataSource] Error fetching profiles:', profilesError);
    throw profilesError;
  }

  const monthStart = getCurrentMonthStart();
  
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

  return reports;
};

export const getPendingUsersRemote = async (): Promise<PendingUser[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, status, created_at, department, position, phone')
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
    department: profile.department,
    position: profile.position,
    phone: profile.phone,
  }));
};

export const getUsersRemote = async (filter?: string): Promise<User[]> => {
  let query = supabase
    .from('profiles')
    .select('id, name, email, role, status, created_at, avatar_url, department, position, phone')
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
    department: profile.department,
    position: profile.position,
    phone: profile.phone,
  }));
};

export const approveUserRemote = async (userId: string): Promise<void> => {
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

export const updateProfileRemote = async (
  userId: string,
  role: 'Colaborador' | 'Gestor' | 'Administrador',
  department?: string,
  position?: string,
  phone?: string
): Promise<void> => {
  const updateData: {
    role: string;
    department?: string | null;
    position?: string | null;
    phone?: string | null;
    updated_at: string;
  } = {
    role,
    updated_at: new Date().toISOString(),
  };

  // Só atualiza campos se foram fornecidos (não vazios)
  if (department !== undefined) {
    updateData.department = department && department.trim() !== '' ? department.trim() : null;
  }
  if (position !== undefined) {
    updateData.position = position && position.trim() !== '' ? position.trim() : null;
  }
  if (phone !== undefined) {
    updateData.phone = phone && phone.trim() !== '' ? phone.trim() : null;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('[AdminRemoteDataSource] Error updating profile:', error);
    throw error;
  }
};

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
}

export const getUserRequestsRemote = async (userId: string): Promise<TeamRequest[]> => {
  const { data, error } = await supabase
    .from('vacation_requests')
    .select('*, profiles(name, avatar_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminRemoteDataSource] Error fetching user requests:', error);
    throw error;
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .eq('id', userId)
    .single();

  return (data as any[]).map((row) => {
    let profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    
    if (!profile || !profile.name) {
      profile = profileData;
    }
    
    return {
      id: row.id,
      employeeId: row.user_id,
      title: row.title,
      employeeName: profile?.name || 'Unknown',
      employeeAvatarUrl: profile?.avatar_url,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status as RequestStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      notes: row.collaborator_notes
    };
  });
};

export const approveRequestRemote = async (requestId: string, notes?: string): Promise<void> => {
  const now = new Date().toISOString();
  
  const { data: updateData, error: updateError } = await supabase
    .from('vacation_requests')
    .update({ 
      status: 'approved', 
      manager_notes: notes, 
      updated_at: now 
    })
    .eq('id', requestId)
    .select();

  if (updateError) {
    console.error('[AdminRemoteDataSource] Error updating vacation_requests:', updateError);
    throw updateError;
  }

  if (!updateData || updateData.length === 0) {
    const error = new Error(`No rows updated for request ${requestId}`);
    console.error('[AdminRemoteDataSource]', error.message);
    throw error;
  }

  const { error: historyError } = await supabase
    .from('vacation_status_history')
    .insert({
      request_id: requestId,
      status: 'approved',
      label: 'Aprovada',
      notes: notes || null,
      created_at: now
    });

  if (historyError) {
  }
};

export const rejectRequestRemote = async (requestId: string, notes?: string): Promise<void> => {
  const now = new Date().toISOString();
  
  const { data: updateData, error: updateError } = await supabase
    .from('vacation_requests')
    .update({ 
      status: 'rejected', 
      manager_notes: notes, 
      updated_at: now 
    })
    .eq('id', requestId)
    .select();

  if (updateError) {
    console.error('[AdminRemoteDataSource] Error updating vacation_requests:', updateError);
    throw updateError;
  }

  if (!updateData || updateData.length === 0) {
    const error = new Error(`No rows updated for request ${requestId}`);
    console.error('[AdminRemoteDataSource]', error.message);
    throw error;
  }

  const { error: historyError } = await supabase
    .from('vacation_status_history')
    .insert({
      request_id: requestId,
      status: 'rejected',
      label: 'Reprovada',
      notes: notes || null,
      created_at: now
    });

  if (historyError) {
  }
};

