import { supabase } from '../../../../../core/services/supabase';
import { Manager } from '../../../domain/entities/Manager';
import { TeamRequest, RequestStatus } from '../../../domain/entities/TeamRequest';

export const getProfileRemote = async (userId: string): Promise<Manager> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
      console.error('[ManagerRemoteDataSource] Error fetching profile:', error);
      throw error;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatarUrl: data.avatar_url,
    role: data.role,
    department: data.department || 'General'
  };
};

interface RemoteRequestDB {
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
  profiles: {
    name: string;
    avatar_url: string;
  } | null;
}

export const getTeamRequestsRemote = async (): Promise<TeamRequest[]> => {
  // Debug: Check user session first
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.id) {
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      // If profile is missing (PGRST116 is "The result contains 0 rows" for .single()), try to create it
      if (profileError && profileError.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'Manager',
                role: 'manager', // Correct role for manager feature
                created_at: new Date().toISOString()
            });
            
          if (createError) {
              console.error('[ManagerRemoteDataSource] Failed to auto-create profile:', createError);
          } else {
              // Retry fetching role
              const retry = await supabase.from('profiles').select('role').eq('id', user.id).single();
              profile = retry.data;
              profileError = retry.error;
          }
      }
  }

  // Debug: Try fetching without join first to check RLS on main table
  const { count } = await supabase
    .from('vacation_requests')
    .select('*', { count: 'exact', head: true });

  const { data, error } = await supabase
    .from('vacation_requests')
    .select('*, profiles(name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ManagerRemoteDataSource] Error:', error);
    throw error;
  }

  if (!data || data.length === 0) {
      // If data is empty but count was > 0, it means the join failed (RLS on profiles?)
      if (count && count > 0) {
          // Fallback: Fetch without profiles join
          const { data: fallbackData } = await supabase
            .from('vacation_requests')
            .select('*')
            .order('created_at', { ascending: false });
            
           if (fallbackData && fallbackData.length > 0) {
               // Manually fetch profiles
               const userIds = [...new Set(fallbackData.map(r => r.user_id))];
               
               const { data: profilesData } = await supabase
                 .from('profiles')
                 .select('id, name, avatar_url')
                 .in('id', userIds);
                 
               const profilesMap = new Map(profilesData?.map(p => [p.id, p]));
               
               return (fallbackData as unknown as RemoteRequestDB[]).map(row => {
                   const profile = profilesMap.get(row.user_id);
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
           }
      }
  }

  // Extrair user_ids únicos para buscar profiles se necessário
  const userIds = [...new Set((data as any[]).map(row => row.user_id))];
  
  // Buscar profiles separadamente para garantir que temos os dados
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .in('id', userIds);
  
  const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
  
  return (data as any[]).map(row => {
    // Tenta pegar do join primeiro, depois do map
    let profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    
    // Se não encontrou no join, busca no map
    if (!profile || !profile.name) {
      profile = profilesMap.get(row.user_id);
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
  
  // 1. Atualizar status na tabela vacation_requests
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
    console.error('[ManagerRemoteDataSource] Error updating vacation_requests:', updateError);
    throw updateError;
  }

  if (!updateData || updateData.length === 0) {
    const error = new Error(`No rows updated for request ${requestId}. Request may not exist or RLS blocked the update.`);
    console.error('[ManagerRemoteDataSource]', error.message);
    throw error;
  }

  // 2. Inserir registro no histórico de status
  const { data: historyData, error: historyError } = await supabase
    .from('vacation_status_history')
    .insert({
      request_id: requestId,
      status: 'approved',
      label: 'Aprovada',
      notes: notes || null,
      created_at: now
    })
    .select();

  if (historyError) {
    // Log o erro mas não falha a operação principal se o histórico falhar
    // Isso garante que a atualização do status sempre aconteça
    // Não lança erro para não bloquear a atualização principal
  }
};

export const rejectRequestRemote = async (requestId: string, notes?: string): Promise<void> => {
  const now = new Date().toISOString();
  
  // 1. Atualizar status na tabela vacation_requests
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
    console.error('[ManagerRemoteDataSource] Error updating vacation_requests:', updateError);
    throw updateError;
  }

  if (!updateData || updateData.length === 0) {
    const error = new Error(`No rows updated for request ${requestId}. Request may not exist or RLS blocked the update.`);
    console.error('[ManagerRemoteDataSource]', error.message);
    throw error;
  }

  // 2. Inserir registro no histórico de status
  const { data: historyData, error: historyError } = await supabase
    .from('vacation_status_history')
    .insert({
      request_id: requestId,
      status: 'rejected',
      label: 'Reprovada',
      notes: notes || null,
      created_at: now
    })
    .select();

  if (historyError) {
    // Log o erro mas não falha a operação principal se o histórico falhar
    // Isso garante que a atualização do status sempre aconteça
    // Não lança erro para não bloquear a atualização principal
  }
};
