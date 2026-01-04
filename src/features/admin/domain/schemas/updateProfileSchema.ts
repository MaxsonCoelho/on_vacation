import { z } from 'zod';

export const updateProfileSchema = z.object({
  role: z
    .enum(['Colaborador', 'Gestor', 'Administrador'], {
      errorMap: () => ({ message: 'Selecione um perfil válido' }),
    }),
  department: z
    .string()
    .max(25, 'O departamento deve ter no máximo 25 caracteres')
    .optional()
    .or(z.literal('')),
  position: z
    .string()
    .max(40, 'O cargo deve ter no máximo 40 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(25, 'O telefone deve ter no máximo 25 caracteres')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

