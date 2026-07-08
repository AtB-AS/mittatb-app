import {useMapContext} from '../map';
import {useVehicle} from './use-vehicle';
import {isVehicle} from './utils';
import {useActiveShmoBookingQuery} from './queries/use-active-shmo-booking-query';
import {ShmoBookingState} from '@atb/api/types/mobility';

export const useMapVehicle = () => {
  const {mapState} = useMapContext();
  const {data: activeShmoBooking} = useActiveShmoBookingQuery(true);

  // During an active trip the rented vehicle is removed from the vehicles feed,
  // so fetching it by id (or via the station mock endpoint) would 404. Vehicle
  // data comes from the active booking instead.
  const hasActiveBooking =
    activeShmoBooking?.state === ShmoBookingState.IN_USE ||
    activeShmoBooking?.state === ShmoBookingState.FINISHING;

  let vehicleId = '';
  if (!mapState.isStationBasedBooking && !hasActiveBooking) {
    if (isVehicle(mapState.feature)) {
      vehicleId = mapState.feature?.properties?.id;
    } else {
      vehicleId = mapState.assetId ?? '';
    }
  }

  const vehicleTypeId = hasActiveBooking ? undefined : mapState.vehicleTypeId;
  const stationId = hasActiveBooking ? undefined : mapState.stationId;

  return useVehicle(vehicleId, vehicleTypeId, stationId);
};
