import {useEffect, useState} from 'react';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {getBikeStation} from '@atb/api/mobility';

export const useBikeStation = (id: string) => {
  const [station, setStation] = useState<BikeStationFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setIsLoading(true);
    const abortCtrl = new AbortController();
    getBikeStation(id, {signal: abortCtrl.signal})
      .then(setStation)
      .then(() => setIsLoading(false))
      .catch(setError);
    return () => abortCtrl.abort();
  }, [id]);

  return {station, isLoading, error};
};
