export type RootStackParamList = {
  RoleSelection: undefined;
  Login: { role: 'Colaborador' | 'Gestor' | 'Administrador' };
  Register: { role: 'Colaborador' | 'Gestor' | 'Administrador' };
  ForgotPassword: { role: 'Colaborador' | 'Gestor' | 'Administrador' };
  ManagerHome: undefined;
  AdminHome: undefined;
  CollaboratorHome: undefined;
};
