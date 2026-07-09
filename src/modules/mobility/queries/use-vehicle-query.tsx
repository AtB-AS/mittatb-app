import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getVehicle} from '@atb/api/mobility';
import {useActiveShmoBookingQuery} from './use-active-shmo-booking-query';
import {ShmoBookingState} from '@atb/api/types/mobility';

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
  const {data: activeShmoBooking} = useActiveShmoBookingQuery(true);

  // A rented vehicle is removed from the vehicles feed for the duration of the
  // trip, so fetching it by id (or via the station endpoint) returns 404.
  // Disable the query while a booking is active; consumers fall back to the
  // active booking's asset for vehicle details.
  const hasActiveBooking =
    activeShmoBooking?.state === ShmoBookingState.IN_USE ||
    activeShmoBooking?.state === ShmoBookingState.FINISHING;

  return useQuery({
    queryKey: getVehicleQueryKey(vehicleId, vehicleTypeId, stationId),
    queryFn: ({signal}) =>
      getVehicle(vehicleId, vehicleTypeId, stationId, {signal}),
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
    enabled: !hasActiveBooking,
  });
};
