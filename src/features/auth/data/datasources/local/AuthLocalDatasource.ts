import { saveSession, getSession, clearSession } from '../../../../../core/facades/sqlite.facade';
import { User } from '../../../domain/entities/User';
import { UserMapper } from '../../mappers/UserMapper';

export const saveUserSession = async (user: User) => {
    await saveSession(user.id, user.email, user.name, user.role, user.status, user.created_at, user.avatar);
};

export const getUserSession = async (): Promise<User | null> => {
    const session = await getSession();
    if (!session) return null;
    return UserMapper.toDomain(session.id, session.email, session.name, session.role, session.status, session.created_at, session.avatar);
};

export const clearUserSession = async () => {
    await clearSession();
};
