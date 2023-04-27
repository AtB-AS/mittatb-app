import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useEffect, useState} from 'react';
import {getVehicle} from '@atb/api/mobility';

export const useVehicle = (id: string, lat: number, lon: number) => {
  const [vehicle, setVehicle] = useState<VehicleExtendedFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setIsLoading(true);
    const abortCtrl = new AbortController();
    getVehicle({id, lat, lon}, {signal: abortCtrl.signal})
      .then(setVehicle)
      .then(() => setIsLoading(false))
      .catch(setError);
    return () => abortCtrl.abort();
  }, [id, lat, lon]);

  return {vehicle, isLoading, error};
};
