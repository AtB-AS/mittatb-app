import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useEffect, useState} from 'react';
import {getVehicle} from '@atb/api/mobility';

export const useVehicle = (id: string) => {
  const [vehicle, setVehicle] = useState<VehicleExtendedFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setIsLoading(true);
    const abortCtrl = new AbortController();
    getVehicle(id, {signal: abortCtrl.signal})
      .then(setVehicle)
      .then(() => setIsLoading(false))
      .catch(setError);
    return () => abortCtrl.abort();
  }, [id]);

  return {vehicle, isLoading, error};
};
