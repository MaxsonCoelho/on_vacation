import { VacationRequest } from '../../domain/entities/VacationRequest';
import { createRequestRemote } from '../datasources/remote/VacationRemoteDatasource';

export const createVacationStrategy = async (payload: VacationRequest) => {
  
  // Vamos modificar o RemoteDatasource para aceitar o objeto completo (ou com ID opcional).
  await createRequestRemote(payload);
};
