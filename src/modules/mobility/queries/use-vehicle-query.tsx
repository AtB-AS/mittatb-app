import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getVehicle} from '@atb/api/mobility';

export const getVehicleQueryKey = (
  vehicleId?: string,
  vehicleTypeId?: string,
  stationId?: string,
) => ['GET_VEHICLE', [vehicleId, vehicleTypeId, stationId]];

export const useVehicleQuery = (
  vehicleId?: string,
  vehicleTypeId?: string,
  stationId?: string,
) => {
  return useQuery({
    queryKey: getVehicleQueryKey(vehicleId, vehicleTypeId, stationId),
    queryFn: ({signal}) =>
      getVehicle(vehicleId, vehicleTypeId, stationId, {signal}),
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
};
