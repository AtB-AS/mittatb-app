import {useQuery} from '@tanstack/react-query';
import {getShmoFaqs} from '@atb/api/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useShmoFaqsQuery = (
  enabled: boolean,
  operatorId: string,
  vehicleTypeId?: string,
) => {
  return useQuery({
    queryKey: ['GET_SHMO_FAQS', operatorId, vehicleTypeId],
    queryFn: ({signal}) => getShmoFaqs(operatorId, vehicleTypeId, {signal}),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    enabled: enabled && !!operatorId,
  });
};
