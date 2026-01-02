import { supabase } from '../../../../../core/services/supabase';
import { Manager } from '../../../domain/entities/Manager';
import { TeamRequest, RequestStatus } from '../../../domain/entities/TeamRequest';

export const getProfileRemote = async (userId: string): Promise<Manager> => {
  console.log('[ManagerRemoteDataSource] Fetching profile for:', userId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
      console.error('[ManagerRemoteDataSource] Error fetching profile:', error);
      throw error;
  }
  
  console.log('[ManagerRemoteDataSource] Profile loaded. Role:', data.role);

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
  console.log('[ManagerRemoteDataSource] Fetching from Supabase...');
  
  // Debug: Check user session first
  const { data: { user } } = await supabase.auth.getUser();
  console.log('[ManagerRemoteDataSource] Current User ID:', user?.id);

  if (user?.id) {
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      // If profile is missing (PGRST116 is "The result contains 0 rows" for .single()), try to create it
      if (profileError && profileError.code === 'PGRST116') {
          console.warn('[ManagerRemoteDataSource] Profile not found for user. Attempting to auto-create Manager profile...');
          
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
              console.log('[ManagerRemoteDataSource] Manager profile created successfully. Retrying fetch...');
              // Retry fetching role
              const retry = await supabase.from('profiles').select('role').eq('id', user.id).single();
              profile = retry.data;
              profileError = retry.error;
          }
      }
      
      console.log('[ManagerRemoteDataSource] Current User Role:', profile?.role, 'Error:', profileError?.message);
  }

  // Debug: Try fetching without join first to check RLS on main table
  const { count, error: countError } = await supabase
    .from('vacation_requests')
    .select('*', { count: 'exact', head: true });
    
  console.log('[ManagerRemoteDataSource] Total requests visible to user (count):', count, 'Error:', countError?.message);

  const { data, error } = await supabase
    .from('vacation_requests')
    .select('*, profiles(name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ManagerRemoteDataSource] Error:', error);
    throw error;
  }

  console.log('[ManagerRemoteDataSource] Data received:', data?.length);
  if (data && data.length > 0) {
      console.log('[ManagerRemoteDataSource] First item sample:', JSON.stringify(data[0], null, 2));
  } else {
      // If data is empty but count was > 0, it means the join failed (RLS on profiles?)
      if (count && count > 0) {
          console.warn('[ManagerRemoteDataSource] WARNING: Requests exist but query returned 0. Possible issue with "profiles" join/RLS.');
          
          // Fallback: Fetch without profiles join
          console.log('[ManagerRemoteDataSource] Attempting fallback fetch without profiles...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('vacation_requests')
            .select('*')
            .order('created_at', { ascending: false });
            
           if (!fallbackError && fallbackData && fallbackData.length > 0) {
               console.log('[ManagerRemoteDataSource] Fallback data received:', fallbackData.length);
               
               // Manually fetch profiles
               const userIds = [...new Set(fallbackData.map(r => r.user_id))];
               console.log('[ManagerRemoteDataSource] Fetching profiles for users:', userIds);
               
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
                    notes: row.collaborator_notes
                   };
               });
           }
      }
  }

  return (data as unknown as RemoteRequestDB[]).map(row => ({
    id: row.id,
    employeeId: row.user_id,
    title: row.title,
    employeeName: row.profiles?.name || 'Unknown',
    employeeAvatarUrl: row.profiles?.avatar_url,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status as RequestStatus,
    createdAt: row.created_at,
    notes: row.collaborator_notes
  }));
};

export const approveRequestRemote = async (requestId: string, notes?: string): Promise<void> => {
  const { error } = await supabase
    .from('vacation_requests')
    .update({ status: 'approved', manager_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) throw error;
};

export const rejectRequestRemote = async (requestId: string, notes?: string): Promise<void> => {
  const { error } = await supabase
    .from('vacation_requests')
    .update({ status: 'rejected', manager_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) throw error;
};
