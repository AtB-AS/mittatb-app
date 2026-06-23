import {useSystem} from './use-system';
import {getRentalAppUri} from './utils';
import {useVehicleQuery} from './queries/use-vehicle-query';
import {useMapContext} from '../map';

export const useMapVehicle = (testVehicleId?: string) => {
  const {mapState} = useMapContext();
  const vehicleId = mapState.isStationBasedBooking
    ? undefined
    : (testVehicleId ??
      mapState.feature?.properties?.id ??
      mapState.assetId ??
      '');

  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicleQuery(vehicleId, mapState.vehicleTypeId, mapState.stationId);

  const {appStoreUri, brandLogoUrl, operatorId, operatorName} = useSystem(
    vehicle,
    vehicle?.system.operator.name,
  );

  return {
    vehicle,
    isLoading,
    isError,
    appStoreUri,
    brandLogoUrl,
    operatorId,
    operatorName,
    rentalAppUri: getRentalAppUri(vehicle),
  };
};
