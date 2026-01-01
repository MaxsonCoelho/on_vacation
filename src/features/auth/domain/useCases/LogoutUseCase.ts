import { AuthRepository } from '../types/AuthRepository';

export const logoutUseCase = (authRepository: AuthRepository) => async () => {
    return await authRepository.logout();
};
