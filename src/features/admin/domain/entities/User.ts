export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Colaborador' | 'Gestor' | 'Administrador';
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  avatarUrl?: string;
}

