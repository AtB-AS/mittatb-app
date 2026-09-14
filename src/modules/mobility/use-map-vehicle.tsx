import {MapBottomSheetType, useMapContext} from '../map';
import {useVehicle} from './use-vehicle';
import {isVehicle} from './utils';

export const useMapVehicle = () => {
  const {mapState} = useMapContext();

  let vehicleId = '';
  // Only a vehicle state carries a vehicle id. The station states overload
  // `assetId` with a *station* id (see mapStateReducer, BikeStationScanned /
  // CarStationScanned), and a scanned station has no `feature` to fall back
  // on -- without this guard we'd request /vehicles/<stationId> and 404.
  if (
    !mapState.isStationBasedBooking &&
    mapState.bottomSheetType === MapBottomSheetType.Vehicle
  ) {
    if (isVehicle(mapState.feature)) {
      vehicleId = mapState.feature?.properties?.id;
    } else {
      vehicleId = mapState.assetId ?? '';
    }
  }

  return useVehicle(vehicleId, mapState.vehicleTypeId, mapState.stationId);
};
