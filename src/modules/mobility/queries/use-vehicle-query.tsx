import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getVehicle} from '@atb/api/mobility';

export const MOCK_VEHICLE_ID = 'mock-vehicle-id';

export const getVehicleQueryKey = (id?: string) => ['GET_VEHICLE', id];

export const useVehicleQuery = (
  id?: string,
  isStationBasedBooking: boolean = false,
) =>
  useQuery({
    queryKey: getVehicleQueryKey(id),
    queryFn: ({signal}) => getVehicle(id, {signal}),
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: isStationBasedBooking ? false : 'always',
    retry: 5,
  });
