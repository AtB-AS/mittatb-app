import {useQuery} from '@tanstack/react-query';
import {getStopPlacesByMode} from '@atb/api/bff/stop-places';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {ONE_DAY_MS, ONE_HOUR_MS} from '@atb/utils/durations';
import {ProductTypeTransportModes} from '@atb-as/config-specs';
import {onlyUniques} from '@atb/utils/only-uniques';

export const useStopPlacesByModeQuery = (
  transportModes?: ProductTypeTransportModes[],
  enabled: boolean = true,
) => {
  const defaultModes = [TransportMode.Water];
  const defaultSubmodes = [
    TransportSubmode.HighSpeedPassengerService,
    TransportSubmode.HighSpeedVehicleService,
  ];

  const uniqueModes = transportModes
    ? transportModes
        .map((tm) => tm.mode)
        .filter(onlyUniques)
        .filter(isValidTransportMode)
    : defaultModes;

  const uniqueSubmodes = transportModes
    ? transportModes
        .map((tm) => tm.subMode)
        .filter(onlyUniques)
        .filter(isValidTransportSubmode)
    : defaultSubmodes;

  return useQuery({
    queryKey: ['stopPlacesByMode', uniqueModes, uniqueSubmodes],
    enabled,
    queryFn: () => getStopPlacesByMode(uniqueModes, uniqueSubmodes),
    staleTime: ONE_HOUR_MS * 6,
    gcTime: ONE_DAY_MS,
  });
};

function isValidTransportMode(mode: any): mode is TransportMode {
  return Object.values(TransportMode).includes(mode);
}

function isValidTransportSubmode(subMode: any): subMode is TransportSubmode {
  return Object.values(TransportSubmode).includes(subMode);
}
