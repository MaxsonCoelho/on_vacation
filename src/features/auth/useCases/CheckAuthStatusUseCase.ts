import { AuthRepository } from '../domain/types/AuthRepository';

export const checkAuthStatusUseCase = (authRepository: AuthRepository) => async () => {
    return await authRepository.checkAuthStatus();
};
