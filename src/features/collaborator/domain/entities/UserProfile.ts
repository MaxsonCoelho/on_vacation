export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'Gestor' | 'Administrador' | 'Colaborador';
  department: string;
  position?: string;
  phone?: string;
  admissionDate: string;
  vacationBalance: number;
  vacationPeriodStart: string;
  vacationPeriodEnd: string;
}
