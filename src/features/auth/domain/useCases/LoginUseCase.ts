import { AuthRepository } from '../types/AuthRepository';

export const loginUseCase = (authRepository: AuthRepository) => async (email: string, password: string) => {
    return await authRepository.login(email, password);
};
