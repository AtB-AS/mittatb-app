import {
  Modes,
  StreetMode,
} from '@atb/api/types/generated/journey_planner_v3_types';

import {defaultJourneyModes} from './utils';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useMemo} from 'react';

export function useJourneyModes(): Modes {
  const {isFlexibleTransportEnabled, isNonTransitTripSearchEnabled} =
    useFeatureTogglesContext();

  return useMemo(
    () => ({
      accessMode: isFlexibleTransportEnabled
        ? StreetMode.Flexible
        : defaultJourneyModes.accessMode,
      directMode: isFlexibleTransportEnabled
        ? StreetMode.Flexible
        : isNonTransitTripSearchEnabled
          ? undefined
          : defaultJourneyModes.directMode,
      egressMode: isFlexibleTransportEnabled
        ? StreetMode.Flexible
        : defaultJourneyModes.egressMode,
    }),
    [isFlexibleTransportEnabled, isNonTransitTripSearchEnabled],
  );
}
