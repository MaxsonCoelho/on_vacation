import { supabase } from '../services/supabase';

export const getDocumentSnapshot = async <T>(collection: string, id: string): Promise<T | null> => {
  
  const { data, error } = await supabase
    .from(collection)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    if (error.code === '42P01') {
      console.error(`Tabela '${collection}' não encontrada no Supabase.`);
      throw new Error(`A tabela '${collection}' não existe no banco de dados. Por favor, execute o script de configuração (supabase_setup.sql).`);
    }
    throw error;
  }

  return data as T;
};

/**
 * TEST ONLY: Verifies authentication with provided credentials.
 * This bypasses the standard login flow to test connectivity and credentials.
 */
export const _test_verifyAuth = async (email: string, pass: string) => {
  if (process.env.NODE_ENV !== 'test') {
    return { error: 'Not in test environment' };
  }
  return await supabase.auth.signInWithPassword({ email, password: pass });
};

