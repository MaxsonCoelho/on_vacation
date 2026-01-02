export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TeamRequest {
  id: string;
  employeeId: string;
  title: string;
  employeeName: string;
  employeeAvatarUrl?: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  createdAt: string;
  notes?: string;
}
