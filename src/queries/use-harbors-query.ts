import {useQuery} from '@tanstack/react-query';
import {getStopPlacesByMode} from '@atb/api/bff/stop-places';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {ProductTypeTransportModes} from '@atb-as/config-specs';
import {onlyUniques} from '@atb/utils/only-uniques';

export const useHarborsQuery = (
  transportModes?: ProductTypeTransportModes[],
) => {
  const waterTransportModes = transportModes?.filter(
    (t) => t.mode === TransportMode.Water,
  );

  const defaultSubmodes = [
    TransportSubmode.HighSpeedPassengerService,
    TransportSubmode.HighSpeedVehicleService,
  ];

  const uniqueSubmodes = waterTransportModes
    ? waterTransportModes
        .map((tm) => tm.subMode)
        .filter(onlyUniques)
        .filter(isValidTransportSubmode)
    : defaultSubmodes;

  return useQuery({
    queryKey: ['harbors', uniqueSubmodes],
    enabled: !transportModes || uniqueSubmodes.length > 0,
    queryFn: () => getStopPlacesByMode([TransportMode.Water], uniqueSubmodes),
    staleTime: ONE_HOUR_MS * 6,
  });
};

function isValidTransportSubmode(subMode: any): subMode is TransportSubmode {
  return Object.values(TransportSubmode).includes(subMode);
}
