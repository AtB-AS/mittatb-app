import {useSystem} from '@atb/mobility/use-system';
import {getRentalAppUri} from '@atb/mobility/utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {useCarStationQuery} from '@atb/mobility/queries/use-car-station-query';

export const useCarSharingStation = (id: string) => {
  const {data: station, isLoading, isError} = useCarStationQuery(id);
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
  };
};
