export type VacationStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface VacationRequest {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  collaboratorNotes?: string;
  managerNotes?: string;
  createdAt: string;
  updatedAt: string;
}
