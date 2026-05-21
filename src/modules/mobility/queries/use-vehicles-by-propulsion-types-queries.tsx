import {useQueries} from '@tanstack/react-query';
import {getVehicles} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const getVehiclesQueryKey = (
  vehicleTypeId?: string,
  stationId?: string,
  sort?: string,
  maxCount?: number,
) => ['GET_VEHICLES', vehicleTypeId, stationId, sort, maxCount];

export const useVehiclesByVehicleTypeIdsQueries = (
  vehicleTypeIds: string[],
  stationId?: string,
  sort?: string,
  maxCount?: number,
) => {
  const results = useQueries({
    queries: vehicleTypeIds.map((vehicleTypeId) => ({
      queryKey: getVehiclesQueryKey(vehicleTypeId, stationId, sort, maxCount),
      queryFn: ({signal}: {signal: AbortSignal}) =>
        getVehicles(
          {vehicleTypeIds: [vehicleTypeId], stationId, sort, maxCount},
          {signal},
        ),
      gcTime: ONE_MINUTE_MS,
      staleTime: 5000,
      retry: 3,
    })),
  });

  return Object.fromEntries(
    vehicleTypeIds.map((id, index) => [id, results[index]]),
  ) as Record<string, (typeof results)[number]>;
};
