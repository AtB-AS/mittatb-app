import {useQuery} from '@tanstack/react-query';
import qs from 'query-string';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {getNearestStopPlaceNodes} from '@atb/api/bff/departures';
import {NearestStopPlacesQueryVariables} from '@atb/api/types/generated/NearestStopPlacesQuery';

export const useNearestStopPlaceNodesQuery = (
  queryVariables?: NearestStopPlacesQueryVariables,
) =>
  useQuery({
    enabled: !!queryVariables,
    queryKey: ['getNearestStopPlaceNodes', qs.stringify(queryVariables ?? {})],
    queryFn: ({signal}) => getNearestStopPlaceNodes(queryVariables, {signal}),
    staleTime: 1 * ONE_HOUR_MS,
    gcTime: 24 * ONE_HOUR_MS,
  });
