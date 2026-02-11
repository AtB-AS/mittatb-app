import {getServiceJourneyWithEstimatedCalls} from '@atb/api/bff/servicejourney';
import {ServiceJourneyDeparture} from './types';
import {useQuery} from '@tanstack/react-query';
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';

export function useDepartureDetailsQuery(
  enabled: boolean,
  activeItem: ServiceJourneyDeparture,
) {
  return useQuery<ServiceJourneyWithEstCallsFragment>({
    queryKey: [
      'departureData',
      activeItem.serviceJourneyId,
      activeItem.serviceDate,
    ],
    queryFn: () =>
      getServiceJourneyWithEstimatedCalls(
        activeItem.serviceJourneyId,
        activeItem.serviceDate,
      ),
    enabled: enabled && !!activeItem,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
  });
}
