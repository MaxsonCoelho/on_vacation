import { getDatabase } from '../../../../../core/offline/database/connection';
import { VacationRequest, VacationStatus } from '../../../domain/entities/VacationRequest';

export const saveRequestLocal = async (request: VacationRequest): Promise<void> => {
  const db = await getDatabase();
  try {
    // Workaround for Android NativeDatabase.prepareAsync NPE with runAsync
    const escape = (str: string | undefined) => str ? str.replace(/'/g, "''") : '';
    
    const collaboratorNotesVal = request.collaboratorNotes ? `'${escape(request.collaboratorNotes)}'` : 'NULL';
    const managerNotesVal = request.managerNotes ? `'${escape(request.managerNotes)}'` : 'NULL';
    const requesterNameVal = request.requesterName ? `'${escape(request.requesterName)}'` : 'NULL';
    const requesterAvatarVal = request.requesterAvatar ? `'${escape(request.requesterAvatar)}'` : 'NULL';

    await db.execAsync(
      `INSERT OR REPLACE INTO vacation_requests (
        id, user_id, title, start_date, end_date, status, collaborator_notes, manager_notes, created_at, updated_at, requester_name, requester_avatar
      ) VALUES (
        '${request.id}',
        '${request.userId}',
        '${escape(request.title)}',
        '${request.startDate}',
        '${request.endDate}',
        '${request.status}',
        ${collaboratorNotesVal},
        ${managerNotesVal},
        '${request.createdAt}',
        '${request.updatedAt}',
        ${requesterNameVal},
        ${requesterAvatarVal}
      )`
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
  const db = await getDatabase();
  console.log('[VacationLocalDatasource] Fetching requests for user:', userId);
  
  try {
    // Tenta passar array vazio explicitamente para evitar NPE no prepareAsync do Android
    const result = await db.getAllAsync(
      `SELECT * FROM vacation_requests WHERE user_id = '${userId}' ORDER BY created_at DESC`,
      []
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
