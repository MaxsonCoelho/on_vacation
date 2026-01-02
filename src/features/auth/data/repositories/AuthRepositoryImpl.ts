import { AuthRepository } from '../../domain/types/AuthRepository';
import * as Remote from '../datasources/remote/AuthRemoteDatasource';
import * as Local from '../datasources/local/AuthLocalDatasource';
import { supabase } from '../../../../core/services/supabase';

export const authRepository: AuthRepository = {
    login: async (email, password) => {
        const user = await Remote.loginRemote(email, password);
        await Local.saveUserSession(user);
        return user;
    },
    logout: async () => {
        try {
            await Remote.logoutRemote();
        } finally {
            await Local.clearUserSession();
        }
    },
    checkAuthStatus: async () => {
        // Primeiro verifica sessão local
        const localUser = await Local.getUserSession();
        console.log('[AuthRepository] checkAuthStatus - localUser:', localUser ? { id: localUser.id, email: localUser.email, role: localUser.role, status: localUser.status } : null);
        
        if (localUser) {
            // Verifica se a sessão do Supabase também está válida
            const { data: { session } } = await supabase.auth.getSession();
            console.log('[AuthRepository] checkAuthStatus - Supabase session:', session ? { userId: session.user.id, email: session.user.email } : null);
            
            if (!session) {
                console.log('[AuthRepository] checkAuthStatus - No Supabase session, clearing local');
                await Local.clearUserSession();
                return null;
            }
            
            if (session.user.id !== localUser.id) {
                console.log('[AuthRepository] checkAuthStatus - User ID mismatch, clearing local');
                await Local.clearUserSession();
                return null;
            }
            
            // Verifica se o usuário ainda está ativo (status pode ter mudado)
            // Normaliza o status para comparação
            const normalizedStatus = (localUser.status || 'active').trim().toLowerCase();
            const isActive = normalizedStatus === 'active';
            
            console.log('[AuthRepository] checkAuthStatus - Status check:', {
                rawStatus: localUser.status,
                normalizedStatus,
                isActive
            });
            
            if (!isActive) {
                console.log('[AuthRepository] checkAuthStatus - User not active, clearing session');
                await Local.clearUserSession();
                await supabase.auth.signOut();
                return null;
            }
            
            console.log('[AuthRepository] checkAuthStatus - User authenticated successfully');
            return localUser;
        }

        console.log('[AuthRepository] checkAuthStatus - No local user found');
        return null;
    }
};
