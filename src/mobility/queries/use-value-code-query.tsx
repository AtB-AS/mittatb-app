import {useQuery} from '@tanstack/react-query';
import {getValueCode} from '@atb/mobility/api/api';

export const useValueCodeQuery = (operatorId: string | undefined) =>
  useQuery({
    queryKey: ['mobilityValueCode', operatorId],
    queryFn: () => getValueCode(operatorId),
  });
