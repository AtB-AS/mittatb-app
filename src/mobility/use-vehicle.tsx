import {useSystem} from '@atb/mobility/use-system';
import {getRentalAppUri} from '@atb/mobility/utils';
import {useVehicleQuery} from '@atb/mobility/queries/use-vehicle-query';
import {useMemo} from 'react';

export const useVehicle = (id: string) => {
  const {data: vehicleData, isLoading, isError} = useVehicleQuery(id);
  const vehicle = useMemo(() => vehicleData, [vehicleData]);
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
