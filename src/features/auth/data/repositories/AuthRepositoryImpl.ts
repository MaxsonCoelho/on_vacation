import { AuthRepository } from '../../domain/types/AuthRepository';
import * as Remote from '../datasources/remote/AuthRemoteDatasource';
import * as Local from '../datasources/local/AuthLocalDatasource';

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
            return localUser;
        }

        return null;
    }
};
