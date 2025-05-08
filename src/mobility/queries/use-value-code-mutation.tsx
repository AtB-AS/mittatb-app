import {useMutation} from '@tanstack/react-query';
import {getValueCode} from '@atb/mobility/api/api';
import {useAuthContext} from '@atb/modules/auth';

export const useValueCodeMutation = (operatorId: string | undefined) => {
  const {userId} = useAuthContext();
  return useMutation({
    mutationKey: ['mobilityValueCode', userId, operatorId],
    mutationFn: () => getValueCode(operatorId),
  });
};
