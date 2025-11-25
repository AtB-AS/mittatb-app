import {getServiceJourneyVehicles} from '@atb/api/bff/vehicles';
import {usePreferencesContext} from '@atb/modules/preferences';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useQuery} from '@tanstack/react-query';

export const useGetServiceJourneyVehiclesQuery = (
  serviceJourneyIds: string[],
  enabled: boolean = true,
) => {
  const {
    preferences: {debugShowProgressBetweenStops},
  } = usePreferencesContext();

  const isFocusedAndActive = useIsFocusedAndActive();
  return useQuery({
    enabled: enabled && isFocusedAndActive,
    queryKey: ['serviceJourneyVehicles', ...serviceJourneyIds],
    queryFn: () => getServiceJourneyVehicles(serviceJourneyIds),
    refetchInterval: debugShowProgressBetweenStops ? 2000 : 20000,
    initialData: [],
  });
};
