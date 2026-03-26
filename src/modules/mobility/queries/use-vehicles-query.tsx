import {useQuery} from '@tanstack/react-query';
import {getVehicles} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';
import {VehicleSortOptions} from '../types';
import {vehiclesQueryKey} from './use-vehicles-by-propulsion-types-queries';

export const useVehiclesQuery = (
  stationId?: string,
  propulsionType?: PropulsionType,
  sort?: VehicleSortOptions,
  maxCount?: number,
) =>
  useQuery({
    queryKey: vehiclesQueryKey(propulsionType, stationId, sort, maxCount),
    queryFn: ({signal}) =>
      getVehicles({propulsionType, stationId, sort, maxCount}, {signal}),
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 3,
  });
