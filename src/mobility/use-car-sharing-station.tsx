import {useEffect, useState} from 'react';
import {CarStationFragment} from '@atb/api/types/generated/fragments/stations';
import {getCarStation} from '@atb/api/mobility';

export const useCarSharingStation = (id: string) => {
  const [station, setStation] = useState<CarStationFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setIsLoading(true);
    const abortCtrl = new AbortController();
    getCarStation(id, {signal: abortCtrl.signal})
      .then(setStation)
      .then(() => setIsLoading(false))
      .catch(setError);
    return () => abortCtrl.abort();
  }, [id]);

  return {station, isLoading, error};
};
