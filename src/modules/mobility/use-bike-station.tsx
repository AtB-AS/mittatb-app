import {useSystem} from './use-system';
import {getAvailableVehicles, getRentalAppUri} from './utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useStationQuery} from './queries/use-station-query';

export const useBikeStation = (id: string) => {
  const {data: station, isLoading, isError} = useStationQuery(id);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(station);

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
