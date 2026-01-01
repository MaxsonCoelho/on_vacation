export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'Gestor' | 'Administrador' | 'Colaborador';
  status: string;
  created_at: string;
}
