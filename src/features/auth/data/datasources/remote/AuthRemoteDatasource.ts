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
        avatar_url?: string;
    }>('profiles', data.user.id);
    
    // Validar se o perfil existe e tem role válida
    if (!userProfile || !userProfile.role) {
         throw new Error('Perfil de usuário não encontrado ou inválido');
    }

    // Validar se o usuário está ativo (aprovado)
    const userStatus = userProfile.status || 'active';
    if (userStatus !== 'active') {
        // Faz logout para limpar a sessão
        await supabase.auth.signOut();
        
        if (userStatus === 'pending') {
            throw new Error('Seu cadastro está pendente de aprovação. Aguarde a aprovação do administrador.');
        } else {
            throw new Error('Seu cadastro não está ativo. Entre em contato com o administrador.');
        }
    }

    return UserMapper.toDomain(
        data.user.id,
        data.user.email,
        userProfile.name || '',
        userProfile.role,
        userStatus,
        userProfile.created_at || new Date().toISOString(),
        userProfile.avatar_url
    );
};

export const logoutRemote = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
