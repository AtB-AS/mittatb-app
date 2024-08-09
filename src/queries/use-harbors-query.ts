import {useQuery} from '@tanstack/react-query';
import {
  getStopPlaceConnections,
  getStopPlacesByMode,
} from '@atb/api/stop-places';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {ONE_HOUR_MS} from "@atb/utils/durations.ts";

export const useHarborsQuery = (fromHarborId?: string) =>
  useQuery({
    queryKey: ['harbors', {connectionFrom: fromHarborId}],
    queryFn: () =>
      fromHarborId
        ? getStopPlaceConnections(fromHarborId)
        : getStopPlacesByMode(
            [TransportMode.Water],
            [
              TransportSubmode.HighSpeedPassengerService,
              TransportSubmode.HighSpeedVehicleService,
            ],
          ),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
