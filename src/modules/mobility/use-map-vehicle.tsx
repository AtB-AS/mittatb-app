import {useMapContext} from '../map';
import {useVehicle} from './use-vehicle';
import {isVehicle} from './utils';

export const useMapVehicle = () => {
  const {mapState} = useMapContext();

  let vehicleId = '';
  if (!mapState.isStationBasedBooking) {
    if (isVehicle(mapState.feature)) {
      vehicleId = mapState.feature?.properties?.id;
    } else {
      vehicleId = mapState.assetId ?? '';
    }
  }

  return useVehicle(vehicleId, mapState.vehicleTypeId, mapState.stationId);
};
