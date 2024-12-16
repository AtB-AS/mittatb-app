import {getServiceJourneyVehicles} from '@atb/api/vehicles';
import {useQuery} from '@tanstack/react-query';

export const useGetServiceJourneyVehiclesQuery = (
  serviceJourneyIds: string[],
  enabled: boolean = true,
) => {
  return useQuery({
    enabled,
    queryKey: ['serviceJourneyVehicles', ...serviceJourneyIds],
    queryFn: () => getServiceJourneyVehicles(serviceJourneyIds),
    refetchInterval: 20000,
    initialData: [],
    retry: false,
  });
};
