import { getDatabase } from '../../../../../core/offline/database/connection';
import { VacationRequest, VacationStatus } from '../../../domain/entities/VacationRequest';

export const saveRequestLocal = async (request: VacationRequest): Promise<void> => {
  const db = await getDatabase();
  try {
    const params = [
      request.id,
      request.userId,
      request.title,
      request.startDate,
      request.endDate,
      request.status,
      request.collaboratorNotes ?? null,
      request.managerNotes ?? null,
      request.createdAt,
      request.updatedAt,
      request.requesterName ?? null,
      request.requesterAvatar ?? null
    ];
    
    await db.runAsync(
      `INSERT OR REPLACE INTO vacation_requests (
        id, user_id, title, start_date, end_date, status, collaborator_notes, manager_notes, created_at, updated_at, requester_name, requester_avatar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    );
  } catch (error) {
    console.error('[VacationLocalDatasource] Error saving request:', error);
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
  requester_name?: string;
  requester_avatar?: string;
}

export const getRequestsLocal = async (userId: string): Promise<VacationRequest[]> => {
  if (!userId) {
      return [];
  }

  const db = await getDatabase();
  
  try {
    // Using parameterized query correctly with runAsync/getAllAsync
    const result = await db.getAllAsync<VacationRequestDB>(
      'SELECT * FROM vacation_requests WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return (result as VacationRequestDB[]).map((item) => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      startDate: item.start_date,
      endDate: item.end_date,
      status: item.status as VacationStatus,
      collaboratorNotes: item.collaborator_notes,
      managerNotes: item.manager_notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      requesterName: item.requester_name,
      requesterAvatar: item.requester_avatar
    }));
  } catch (error) {
    console.error('[VacationLocalDatasource] Error fetching requests:', error);
    throw error;
  }
};
