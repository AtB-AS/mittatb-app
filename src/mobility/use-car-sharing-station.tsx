import {useEffect, useState} from 'react';
import {CarStationFragment} from '@atb/api/types/generated/fragments/stations';
import {getCarStation} from '@atb/api/mobility';
import {useSystem} from '@atb/mobility/use-system';
import {getRentalAppUri} from '@atb/mobility/utils';
import {useTextForLanguage} from '@atb/translations/utils';

export const useCarSharingStation = (id: string) => {
  const [station, setStation] = useState<CarStationFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(station);

  useEffect(() => {
    setIsLoading(true);
    const abortCtrl = new AbortController();
    getCarStation(id, {signal: abortCtrl.signal})
      .then(setStation)
      .then(() => setIsLoading(false))
      .catch(setError);
    return () => abortCtrl.abort();
  }, [id]);

  return {
    station,
    isLoading,
    error,
    appStoreUri,
    brandLogoUrl,
    operatorId,
    operatorName,
    rentalAppUri: getRentalAppUri(station),
    stationName: useTextForLanguage(station?.name.translation),
  };
};
