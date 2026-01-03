import { supabase } from '../../../../../core/services/supabase';
import { VacationRequest, VacationStatus } from '../../../domain/entities/VacationRequest';
import { generateUUID } from '../../../../../core/utils';

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
  request: Partial<VacationRequest>
): Promise<void> => {
  if (!request.userId || !request.title || !request.startDate || !request.endDate) {
    throw new Error('Missing required fields');
  }

  const now = new Date().toISOString();
  const requestId = request.id || generateUUID();
  
  const payload = {
    id: requestId,
    user_id: request.userId,
    title: request.title,
    start_date: new Date(request.startDate.split('/').reverse().join('-')), // Convert DD/MM/YYYY to YYYY-MM-DD
    end_date: new Date(request.endDate.split('/').reverse().join('-')),
    collaborator_notes: request.collaboratorNotes,
    status: request.status || 'pending',
  };

  // 1. Criar solicitação na tabela vacation_requests
  const { data: insertData, error: insertError } = await supabase
    .from('vacation_requests')
    .insert(payload)
    .select();

  if (insertError) {
    console.error('[VacationRemoteDatasource] Error creating vacation request:', insertError);
    throw new Error(insertError.message);
  }

  // 2. Criar registro inicial no histórico de status
  const { data: historyData, error: historyError } = await supabase
    .from('vacation_status_history')
    .insert({
      request_id: requestId,
      status: request.status || 'pending',
      label: 'Solicitada',
      notes: request.collaboratorNotes || null,
      created_at: now
    })
    .select();

  if (historyError) {
    // Log o erro mas não falha a operação principal se o histórico falhar
    // Silent fail - status history is non-critical
  }
};
