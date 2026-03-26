import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';
import {useQueries} from '@tanstack/react-query';
import {getVehicles} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const vehiclesQueryKey = (
  propulsionType?: PropulsionType,
  stationId?: string,
  sort?: string,
  maxCount?: number,
) => ['GET_VEHICLES', propulsionType, stationId, sort, maxCount];

export const useVehiclesByPropulsionTypesQueries = (
  stationId?: string,
  sort?: string,
  maxCount?: number,
) => {
  const [humanQuery, electricQuery, electricAssistQuery] = useQueries({
    queries: [
      PropulsionType.Human,
      PropulsionType.Electric,
      PropulsionType.ElectricAssist,
    ].map((propulsionType) => ({
      queryKey: vehiclesQueryKey(propulsionType, stationId, sort, maxCount),
      queryFn: ({signal}) =>
        getVehicles({propulsionType, stationId, sort, maxCount}, {signal}),
      gcTime: ONE_MINUTE_MS,
      staleTime: 5000,
      retry: 3,
    })),
  });

  return {humanQuery, electricQuery, electricAssistQuery};
};
