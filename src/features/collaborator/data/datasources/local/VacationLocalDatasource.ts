import { getDatabase } from '../../../../../core/offline/database/connection';
import { VacationRequest, VacationStatus } from '../../../domain/entities/VacationRequest';

export const saveRequestLocal = async (request: VacationRequest): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO vacation_requests (
      id, user_id, title, start_date, end_date, status, collaborator_notes, manager_notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      request.id,
      request.userId,
      request.title,
      request.startDate,
      request.endDate,
      request.status,
      request.collaboratorNotes || null,
      request.managerNotes || null,
      request.createdAt,
      request.updatedAt,
    ]
  );
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

export const getRequestsLocal = async (userId: string): Promise<VacationRequest[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM vacation_requests WHERE user_id = ? ORDER BY created_at DESC`,
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
  }));
};
