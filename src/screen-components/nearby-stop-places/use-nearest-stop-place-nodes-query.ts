import {useQuery} from '@tanstack/react-query';
import qs from 'query-string';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {getNearestStopPlaceNodes} from '@atb/api/bff/departures';
import {NearestStopPlacesQueryVariables} from '@atb/api/types/generated/NearestStopPlacesQuery';
import {snapCoordinatesToGrid} from '@atb/utils/snap-coordinates-to-grid';

/**
 * @param queryVariables - The query variables, including latitude and longitude.
 * @param snapCellSizeMeters
 * * To avoid unnecessary calls from small location changes, the coordinates are snapped to a grid.
 * snapCellSizeMeters is the size in meters for each cell, and coordinates are snapped to the center of each cell.
 * @returns Query result from React Query for nearest stop place nodes.
 */
export const useNearestStopPlaceNodesQuery = (
  queryVariables?: NearestStopPlacesQueryVariables,
  snapCellSizeMeters: number = 100,
) => {
  const snappedCoordinates = snapCoordinatesToGrid(
    {
      latitude: queryVariables?.latitude ?? 0,
      longitude: queryVariables?.longitude ?? 0,
    },
    snapCellSizeMeters,
  );
  const snappedQueryVariables: NearestStopPlacesQueryVariables | undefined =
    queryVariables &&
      snappedCoordinates && {
        ...queryVariables,
        ...snappedCoordinates,
      };

  return useQuery({
    enabled: !!queryVariables,
    queryKey: [
      'getNearestStopPlaceNodes',
      qs.stringify(snappedQueryVariables ?? {}),
    ],
    queryFn: ({signal}) =>
      getNearestStopPlaceNodes(snappedQueryVariables, {signal}),
    staleTime: 1 * ONE_HOUR_MS,
    gcTime: 24 * ONE_HOUR_MS,
    meta: {
      persistInAsyncStorage: true,
    },
  });
};
