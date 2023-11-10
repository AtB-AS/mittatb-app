import {useSystem} from '@atb/mobility/use-system';
import {getAvailableVehicles, getRentalAppUri} from '@atb/mobility/utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useBikeStationQuery} from '@atb/mobility/queries/use-bike-station-query';

export const useBikeStation = (id: string) => {
  const {data: station, isLoading, isError} = useBikeStationQuery(id);
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
