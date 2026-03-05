import {useSystem} from './use-system';
import {getRentalAppUri} from './utils';
import {useVehicleQuery} from './queries/use-vehicle-query';

export const useVehicle = (id?: string) => {
  const {data: vehicle, isLoading, isError} = useVehicleQuery(id);
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
