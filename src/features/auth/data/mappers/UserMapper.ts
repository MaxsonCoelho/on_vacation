import { User } from '../../domain/entities/User';

export const UserMapper = {
    toDomain: (id: string, email: string, name: string, role: string, status: string, created_at: string, avatar?: string): User => {
        return {
            id,
            email,
            name,
            role: role as User['role'],
            status,
            created_at,
            avatar
        };
    }
};
