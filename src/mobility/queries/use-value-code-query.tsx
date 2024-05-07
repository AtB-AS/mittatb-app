import {useQuery} from '@tanstack/react-query';
import {getValueCode} from '@atb/mobility/api/api';
import {useAuthState} from '@atb/auth';

export const useValueCodeQuery = (operatorId: string | undefined) => {
  const {userId, authStatus} = useAuthState();
  return useQuery({
    queryKey: ['mobilityValueCode', userId, operatorId],
    queryFn: () => getValueCode(operatorId),
    enabled: authStatus === 'authenticated',
  });
};
