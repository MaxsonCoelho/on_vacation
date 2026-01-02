import { supabase } from '../../../../../core/services/supabase';
import { VacationRequest, VacationStatus } from '../../../domain/entities/VacationRequest';

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

export const getRequestsRemote = async (userId: string): Promise<VacationRequest[]> => {
  const { data, error } = await supabase
    .from('vacation_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vacation requests:', error);
    throw new Error(error.message);
  }

  console.log('[RemoteDatasource] Raw data received:', data?.length);

  // Map DB columns to Entity
  return (data as VacationRequestDB[]).map((item) => {
    // Manually parse date string to avoid timezone issues
    const [startYear, startMonth, startDay] = item.start_date.split('-');
    const [endYear, endMonth, endDay] = item.end_date.split('-');
    
    return {
      id: item.id,
      userId: item.user_id,
      title: item.title,
      startDate: `${startDay}/${startMonth}/${startYear}`,
      endDate: `${endDay}/${endMonth}/${endYear}`,
      status: item.status as VacationStatus,
      collaboratorNotes: item.collaborator_notes,
      managerNotes: item.manager_notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  });
};

export const createRequestRemote = async (
  request: Omit<VacationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'managerNotes'>
): Promise<void> => {
  const payload = {
    user_id: request.userId,
    title: request.title,
    start_date: new Date(request.startDate.split('/').reverse().join('-')), // Convert DD/MM/YYYY to YYYY-MM-DD
    end_date: new Date(request.endDate.split('/').reverse().join('-')),
    collaborator_notes: request.collaboratorNotes,
    status: 'pending',
  };

  console.log('[RemoteDatasource] Creating request payload:', JSON.stringify(payload));

  const { error } = await supabase.from('vacation_requests').insert(payload);

  if (error) {
    console.error('Error creating vacation request:', error);
    throw new Error(error.message);
  }
};
