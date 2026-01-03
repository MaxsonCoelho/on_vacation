export interface AdminReports {
  // Visão Geral - Solicitações
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  
  // Usuários do Sistema
  totalCollaborators: number;
  totalManagers: number;
  activeCollaborators: number;
  pendingRegistrations: number;
  
  // Este Mês
  newRequestsThisMonth: number;
  approvedRequestsThisMonth: number;
  newRegistrationsThisMonth: number;
}

