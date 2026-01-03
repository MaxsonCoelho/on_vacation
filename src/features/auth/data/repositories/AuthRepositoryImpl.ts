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
        
        if (localUser) {
            // Verifica se a sessão do Supabase também está válida
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                await Local.clearUserSession();
                return null;
            }
            
            if (session.user.id !== localUser.id) {
                await Local.clearUserSession();
                return null;
            }
            
            // Verifica se o usuário ainda está ativo (status pode ter mudado)
            // Normaliza o status para comparação
            const normalizedStatus = (localUser.status || 'active').trim().toLowerCase();
            const isActive = normalizedStatus === 'active';
            
            if (!isActive) {
                await Local.clearUserSession();
                await supabase.auth.signOut();
                return null;
            }
            
            return localUser;
        }

        return null;
    }
};
