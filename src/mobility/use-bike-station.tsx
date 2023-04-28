import {useEffect, useState} from 'react';
import {getBikeStation} from '@atb/api/stations';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';

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
