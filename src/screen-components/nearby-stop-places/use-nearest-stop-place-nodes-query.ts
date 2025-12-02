import {useQuery} from '@tanstack/react-query';
import qs from 'query-string';
import {NearestStopPlaceNode} from '@atb/api/types/departures';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {getNearestStopPlaces} from '@atb/api/bff/departures';
import {
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from '@atb/api/types/generated/NearestStopPlacesQuery';

export const useNearestStopPlaceNodesQuery = (
  queryVariables?: NearestStopPlacesQueryVariables,
) => {
  return useQuery({
    enabled: !!queryVariables,
    queryKey: ['getNearestStopPlaceNodes', qs.stringify(queryVariables ?? {})],
    queryFn: ({signal}) => getNearestStopPlaces(queryVariables, {signal}),
    select: (nearestStopPlacesQuery: NearestStopPlacesQuery | null) => {
      console.log('select!');
      const nearestStopPlaceNodes =
        nearestStopPlacesQuery?.nearest?.edges
          // Cast to NearestStopPlaceNode, as it is the only possible type returned from bff
          ?.map((e) => e.node as NearestStopPlaceNode)
          .filter((n): n is NearestStopPlaceNode => !!n) || [];

      return sortAndFilterStopPlaces(nearestStopPlaceNodes);
    },
    staleTime: 60 * ONE_SECOND_MS, // todo: use ONE_DAY_MS
    gcTime: 60 * ONE_SECOND_MS, // todo: use ONE_DAY_MS
    retry: 3,
    meta: {
      persistInAsyncStorage: true,
    },
  });
};

function sortAndFilterStopPlaces(
  data?: NearestStopPlaceNode[],
): NearestStopPlaceNode[] {
  if (!data) return [];

  // Sort StopPlaces on distance from search location
  const sortedNodes = data?.sort((n1, n2) => {
    if (n1.distance === undefined) return 1;
    if (n2.distance === undefined) return -1;
    return n1.distance > n2.distance ? 1 : -1;
  });

  // Remove all StopPlaces without Quays
  return sortedNodes.filter((n) => n.place?.quays?.length);
}
