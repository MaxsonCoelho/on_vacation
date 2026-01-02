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
    // Normaliza o status: remove espaços e converte para lowercase para comparação
    const rawStatus = (userProfile.status || 'active').trim().toLowerCase();
    const isActive = rawStatus === 'active';
    
    console.log('[AuthRemote] User status check:', {
        userId: data.user.id,
        email: data.user.email,
        rawStatus: userProfile.status,
        normalizedStatus: rawStatus,
        isActive,
        role: userProfile.role
    });
    
    if (!isActive) {
        // Faz logout para limpar a sessão
        await supabase.auth.signOut();
        
        if (rawStatus === 'pending') {
            throw new Error('Seu cadastro está pendente de aprovação. Aguarde a aprovação do administrador.');
        } else {
            throw new Error(`Seu cadastro não está ativo (status: ${userProfile.status}). Entre em contato com o administrador.`);
        }
    }

    return UserMapper.toDomain(
        data.user.id,
        data.user.email,
        userProfile.name || '',
        userProfile.role,
        'active', // Sempre retorna 'active' quando passa na validação
        userProfile.created_at || new Date().toISOString(),
        userProfile.avatar_url
    );
};

export const logoutRemote = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
