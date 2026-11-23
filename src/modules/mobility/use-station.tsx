import {useSystem} from './use-system';
import {useTextForLanguage} from '@atb/translations/utils';
import {useStationQuery} from './queries/use-station-query';

export const useStation = (id: string) => {
  const {data: station, isLoading, isError} = useStationQuery(id);
  const formFactor =
    station?.vehicleTypesAvailable?.[0]?.vehicleType.formFactor;
  const propulsionType =
    station?.vehicleTypesAvailable?.[0]?.vehicleType.propulsionType;
  const {operatorId, operatorName} = useSystem(station);

  return {
    station,
    isLoading,
    isError,
    operatorId,
    operatorName,
    stationName: useTextForLanguage(station?.name.translation),
    formFactor,
    propulsionType,
  };
};
