import { supabase } from '../../../../../core/services/supabase';
import { UserProfile } from '../../../domain/entities/UserProfile';

export const getProfileRemote = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Mocking fields not present in DB yet or using defaults
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatar: data.avatar_url,
    role: data.role,
    department: data.department || 'Tecnologia', 
    admissionDate: data.admission_date ? new Date(data.admission_date).toLocaleDateString('pt-BR') : '01/01/2023',
    vacationBalance: 15, // Mocked logic
    vacationPeriodStart: '01/01/2023',
    vacationPeriodEnd: '01/01/2024',
  };
};
