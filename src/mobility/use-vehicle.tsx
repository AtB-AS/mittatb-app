import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useEffect, useState} from 'react';
import {getVehicle} from '@atb/api/mobility';
import {useSystem} from '@atb/mobility/use-system';
import {getRentalAppUri} from '@atb/mobility/utils';

export const useVehicle = (id: string) => {
  const [vehicle, setVehicle] = useState<VehicleExtendedFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} = useSystem(
    vehicle,
    vehicle?.system.operator.name,
  );

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const abortCtrl = new AbortController();
    getVehicle(id, {signal: abortCtrl.signal})
      .then(setVehicle)
      .then(() => setIsLoading(false))
      .catch(() => setIsError(true));
    return () => abortCtrl.abort();
  }, [id]);

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
