import {useQuery} from '@tanstack/react-query';
import {getStopPlacesByMode} from '@atb/api/bff/stop-places';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {ONE_HOUR_MS, ONE_WEEK_MS} from '@atb/utils/durations';
import {ProductTypeTransportModes} from '@atb-as/config-specs';
import {onlyUniques} from '@atb/utils/only-uniques';

export const useStopPlacesByModeQuery = (
  transportModes: ProductTypeTransportModes[] = [],
  enabled: boolean = true,
) => {
  const uniqueModes = transportModes
    .map((tm) => tm.mode)
    .filter(onlyUniques)
    .filter(isValidTransportMode);

  const uniqueSubmodes = transportModes
    .map((tm) => tm.subMode)
    .filter(onlyUniques)
    .filter(isValidTransportSubmode);

  return useQuery({
    queryKey: ['stopPlacesByMode', uniqueModes, uniqueSubmodes],
    enabled: enabled && !!transportModes.length,
    queryFn: () => getStopPlacesByMode(uniqueModes, uniqueSubmodes),
    staleTime: ONE_HOUR_MS * 12,
    gcTime: ONE_WEEK_MS,
    meta: {
      persistInAsyncStorage: true,
    },
  });
};

function isValidTransportMode(mode: any): mode is TransportMode {
  return Object.values(TransportMode).includes(mode);
}

function isValidTransportSubmode(subMode: any): subMode is TransportSubmode {
  return Object.values(TransportSubmode).includes(subMode);
}
