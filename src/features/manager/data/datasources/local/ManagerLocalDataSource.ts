import { getDatabase } from '../../../../../core/offline/database/connection';
import { Manager } from '../../../domain/entities/Manager';
import { TeamRequest, RequestStatus } from '../../../domain/entities/TeamRequest';

interface AuthSessionDB {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
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

export const getProfileLocal = async (): Promise<Manager | null> => {
  const db = await getDatabase();
  const result = await db.getAllAsync(`SELECT * FROM auth_session LIMIT 1`, []);
  
  if (result.length > 0) {
    const row = result[0] as AuthSessionDB;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar,
      role: row.role as 'manager',
      department: 'General' 
    };
  }
  return null;
};

export const getTeamRequestsLocal = async (): Promise<TeamRequest[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM vacation_requests ORDER BY created_at DESC`,
    []
  );

  return (result as VacationRequestDB[]).map(row => ({
    id: row.id,
    employeeId: row.user_id,
    title: row.title,
    employeeName: row.requester_name || 'Unknown',
    employeeAvatarUrl: row.requester_avatar,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status as RequestStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.collaborator_notes
  }));
};

export const saveRequestsLocal = async (requests: TeamRequest[]): Promise<void> => {
  const db = await getDatabase();
  for (const req of requests) {
    // Check if exists and compare updatedAt to prevent overwriting newer local changes
    const existing = await db.getAllAsync<VacationRequestDB>(
         'SELECT updated_at FROM vacation_requests WHERE id = ?', 
         [req.id]
     );

     let shouldUpdate = true;
     if (existing.length > 0) {
         const localUpdated = new Date(existing[0].updated_at).getTime();
         const remoteUpdated = new Date(req.updatedAt || req.createdAt).getTime();
         
         // If local is NEWER than remote (e.g. pending sync), DO NOT OVERWRITE
         if (localUpdated > remoteUpdated) {
             // console.log(`[ManagerLocal] Skipping update for ${req.id} (Local is newer)`);
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
                req.employeeId, 
                req.title, 
                req.startDate, 
                req.endDate, 
                req.status, 
                req.notes || '', 
                '', 
                req.createdAt, 
                req.updatedAt || new Date().toISOString(), 
                req.employeeName, 
                req.employeeAvatarUrl || ''
            ]
        );
    }
  }
};

export const updateRequestStatusLocal = async (requestId: string, status: string, notes?: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE vacation_requests SET status = ?, manager_notes = ?, updated_at = ? WHERE id = ?`,
    [status, notes || '', new Date().toISOString(), requestId]
  );
};
