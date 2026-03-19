import {useQuery} from '@tanstack/react-query';
import {getVehicles} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';

export const useVehiclesQuery = (
  stationId?: string,
  propulsionType?: PropulsionType,
  sort?: 'currentRangeMeters',
  maxCount?: number,
) =>
  useQuery({
    queryKey: ['getVehicles', propulsionType, stationId, sort, maxCount],
    queryFn: ({signal}) =>
      getVehicles({propulsionType, stationId, sort, maxCount}, {signal}),
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
