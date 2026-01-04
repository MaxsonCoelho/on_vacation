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

export const registerRemote = async (
    email: string,
    password: string,
    name: string,
    role: 'Colaborador' | 'Gestor' | 'Administrador',
    department?: string,
    position?: string,
    phone?: string
): Promise<void> => {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha ao criar usuário');

    // 2. Criar profile no Supabase com status 'pending'
    // O profile pode ser criado automaticamente via trigger, mas garantimos que esteja correto
    const profileData: {
        id: string;
        email: string;
        name: string;
        role: string;
        status: string;
        created_at: string;
        department?: string;
        position?: string;
        phone?: string;
    } = {
        id: authData.user.id,
        email: email,
        name: name,
        role: role,
        status: 'pending',
        created_at: new Date().toISOString(),
    };

    if (department) profileData.department = department;
    if (position) profileData.position = position;
    if (phone) profileData.phone = phone;

    const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

    if (profileError) {
        // Se o erro for de duplicata (profile já existe via trigger), tenta atualizar
        if (profileError.code === '23505') {
            const updateData: {
                email: string;
                name: string;
                role: string;
                status: string;
                department?: string;
                position?: string;
                phone?: string;
            } = {
                email: email,
                name: name,
                role: role,
                status: 'pending',
            };

            if (department) updateData.department = department;
            if (position) updateData.position = position;
            if (phone) updateData.phone = phone;

            const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', authData.user.id);

            if (updateError) throw updateError;
        } else {
            throw profileError;
        }
    }
};
