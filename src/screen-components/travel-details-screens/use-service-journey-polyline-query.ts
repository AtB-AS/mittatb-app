import {getServiceJourneyPolyline} from '@atb/api/bff/servicejourney';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export function useServiceJourneyPolylineQuery(
  serviceJourneyId?: string,
  fromQuayId?: string,
  toQuayId?: string,
) {
  return useQuery({
    queryKey: [
      'serviceJourneyPolyline',
      serviceJourneyId,
      fromQuayId,
      toQuayId,
    ],
    queryFn: async () => {
      if (!serviceJourneyId || !fromQuayId) return null;
      return getServiceJourneyPolyline(serviceJourneyId, fromQuayId, toQuayId);
    },
    staleTime: ONE_HOUR_MS,
  });
}
