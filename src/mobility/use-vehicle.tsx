import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useEffect, useState} from 'react';
import {getVehicle} from '@atb/api/mobility';
import {useSystem} from '@atb/mobility/use-system';
import {getRentalAppUri} from '@atb/mobility/utils';

export const useVehicle = (id: string) => {
  const [vehicle, setVehicle] = useState<VehicleExtendedFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} = useSystem(
    vehicle,
    vehicle?.system.operator.name,
  );

  useEffect(() => {
    setIsLoading(true);
    const abortCtrl = new AbortController();
    getVehicle(id, {signal: abortCtrl.signal})
      .then(setVehicle)
      .then(() => setIsLoading(false))
      .catch(setError);
    return () => abortCtrl.abort();
  }, [id]);

  return {
    vehicle,
    isLoading,
    error,
    appStoreUri,
    brandLogoUrl,
    operatorId,
    operatorName,
    rentalAppUri: getRentalAppUri(vehicle),
  };
};
