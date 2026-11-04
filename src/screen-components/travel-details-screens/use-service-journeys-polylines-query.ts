import {
  ServiceJourneyPolylines,
  ServiceJourneyPolylinesQuery,
  ServiceJourneyPolylinesWithId,
} from '@atb/api/types/serviceJourney';
import {getServiceJourneyPolylines} from '@atb/api/bff/servicejourney';
import {QueryObserverResult, useQueries} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

/**
 * Fetches the polylines for several service journeys in parallel, one request
 * per service journey. `data` contains the polylines of the requests that have
 * succeeded, so failed service journeys are left out.
 */
export function useServiceJourneysPolylinesQuery(
  serviceJourneys: ServiceJourneyPolylinesQuery[],
  enabled = true,
) {
  return useQueries({
    queries: serviceJourneys.map(
      ({serviceJourneyId, fromQuayId, toQuayId}) => ({
        queryKey: [
          'serviceJourneyPolyline',
          serviceJourneyId,
          fromQuayId,
          toQuayId,
        ],
        queryFn: () =>
          getServiceJourneyPolylines(serviceJourneyId, fromQuayId, toQuayId),
        select: (data: ServiceJourneyPolylines) => ({
          serviceJourneyId,
          ...data,
        }),
        staleTime: ONE_HOUR_MS,
        gcTime: ONE_HOUR_MS,
        enabled,
      }),
    ),
    combine: combinePolylinesResults,
  });
}

function combinePolylinesResults(
  results: QueryObserverResult<ServiceJourneyPolylinesWithId>[],
) {
  return {
    data: results.flatMap((result) => (result.data ? [result.data] : [])),
    isLoading: results.some((result) => result.isLoading),
  };
}
