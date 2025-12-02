import {useQuery} from '@tanstack/react-query';
import qs from 'query-string';
import {NearestStopPlaceNode} from '@atb/api/types/departures';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {getNearestStopPlaces} from '@atb/api/bff/departures';
import {
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from '@atb/api/types/generated/NearestStopPlacesQuery';
import {useCallback} from 'react';

export const useNearestStopPlaceNodesQuery = (
  queryVariables?: NearestStopPlacesQueryVariables,
) => {
  const select = useCallback(
    (nearestStopPlacesQuery: NearestStopPlacesQuery | null) => {
      const nearestStopPlaceNodes =
        nearestStopPlacesQuery?.nearest?.edges
          // Cast to NearestStopPlaceNode, as it is the only possible type returned from bff
          ?.map((e) => e.node as NearestStopPlaceNode)
          .filter((n): n is NearestStopPlaceNode => !!n) || [];

      return sortAndFilterStopPlaces(nearestStopPlaceNodes);
    },
    [],
  );

  return useQuery({
    enabled: !!queryVariables,
    queryKey: ['getNearestStopPlaceNodes', qs.stringify(queryVariables ?? {})],
    queryFn: ({signal}) => getNearestStopPlaces(queryVariables, {signal}),
    select,
    staleTime: 5 * ONE_HOUR_MS,
    gcTime: 5 * ONE_HOUR_MS,
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
