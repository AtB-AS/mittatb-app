import {useEffect, useState} from 'react';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {getBikeStation} from '@atb/api/mobility';
import {useSystem} from '@atb/mobility/use-system';
import {getAvailableVehicles, getRentalAppUri} from '@atb/mobility/utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const useBikeStation = (id: string) => {
  const [station, setStation] = useState<BikeStationFragment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(station);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const abortCtrl = new AbortController();
    getBikeStation(id, {signal: abortCtrl.signal})
      .then(setStation)
      .then(() => setIsLoading(false))
      .catch(() => setIsError(true));
    return () => abortCtrl.abort();
  }, [id]);

  return {
    station,
    isLoading,
    isError,
    appStoreUri,
    brandLogoUrl,
    operatorId,
    operatorName,
    rentalAppUri: getRentalAppUri(station),
    stationName: useTextForLanguage(station?.name.translation),
    availableBikes: getAvailableVehicles(
      station?.vehicleTypesAvailable,
      FormFactor.Bicycle,
    ),
  };
};
