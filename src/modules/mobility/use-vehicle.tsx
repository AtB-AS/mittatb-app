import {useSystem} from './use-system';
import {getRentalAppUri} from './utils';
import {useVehicleQuery} from './queries/use-vehicle-query';

export const useVehicle = (
  vehicleId?: string,
  vehicleTypeId?: string,
  stationId?: string,
) => {
  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicleQuery(vehicleId, vehicleTypeId, stationId);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(vehicle);

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
