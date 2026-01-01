import { supabase } from '../../../../../core/services/supabase';
import { getDocumentSnapshot } from '../../../../../core/facades/database.facade';
import { User } from '../../../domain/entities/User';
import { UserMapper } from '../../mappers/UserMapper';

export const loginRemote = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    if (!data.user || !data.user.email) throw new Error('Falha na autenticação: Usuário sem email');

    const userProfile = await getDocumentSnapshot<{
        name: string;
        role: string;
        status: string;
        created_at: string;
        avatar?: string;
    }>('users', data.user.id);
    
    // Validar se o perfil existe e tem role válida
    if (!userProfile || !userProfile.role) {
         throw new Error('Perfil de usuário não encontrado ou inválido');
    }

    return UserMapper.toDomain(
        data.user.id,
        data.user.email,
        userProfile.name || '',
        userProfile.role,
        userProfile.status || 'active',
        userProfile.created_at || new Date().toISOString(),
        userProfile.avatar
    );
};

export const logoutRemote = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
