import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(40, 'O nome deve ter no máximo 40 caracteres'),
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .max(40, 'O e-mail deve ter no máximo 40 caracteres'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(10, 'A senha deve ter no máximo 10 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'A confirmação de senha é obrigatória')
    .max(10, 'A confirmação de senha deve ter no máximo 10 caracteres'),
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
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

