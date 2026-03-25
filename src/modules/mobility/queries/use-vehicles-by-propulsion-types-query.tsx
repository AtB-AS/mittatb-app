import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';
import {useQueries} from '@tanstack/react-query';
import {getVehicles} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const useVehiclesByPropulsionTypesQuery = (
  stationId?: string,
  sort?: string,
  maxCount?: number,
) =>
  useQueries({
    queries: [
      PropulsionType.Human,
      PropulsionType.Electric,
      PropulsionType.ElectricAssist,
    ].map((propulsionType) => ({
      queryKey: ['GET_VEHICLES', propulsionType, stationId, sort, maxCount],
      queryFn: ({signal}) =>
        getVehicles({propulsionType, stationId, sort, maxCount}, {signal}),
      gcTime: ONE_MINUTE_MS,
      refetchOnMount: 'always',
      retry: 3,
    })),
  });
