import {useMutation} from '@tanstack/react-query';
import {getValueCode} from '@atb/mobility/api/api';
import {useAuthState} from '@atb/auth';

export const useValueCodeMutation = (operatorId: string | undefined) => {
  const {userId} = useAuthState();
  return useMutation({
    mutationKey: ['mobilityValueCode', userId, operatorId],
    mutationFn: () => getValueCode(operatorId),
  });
};
