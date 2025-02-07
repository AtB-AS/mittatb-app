import {useSystem} from '@atb/mobility/use-system';
import {getAvailableVehicles, getRentalAppUri} from '@atb/mobility/utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useBikeStationQuery} from '@atb/mobility/queries/use-bike-station-query';

export const useBikeStation = (id: string) => {
  const {data: station, isLoading, isError} = useBikeStationQuery(id);
  const {appStoreUri, operatorId, operatorName} = useSystem(station);

  const brandLogoUrl =
    'data:image/png;base64,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IAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAACAAMCPAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAgAPAjAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAAgAAAAAAIAAAA4Iz+P3k+RISoUrXIAAAAAElFTkSuQmCC';

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
