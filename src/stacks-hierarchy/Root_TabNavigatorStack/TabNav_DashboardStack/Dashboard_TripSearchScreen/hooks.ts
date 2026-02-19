import {
  Modes,
  StreetMode,
} from '@atb/api/types/generated/journey_planner_v3_types';

import {defaultJourneyModes} from './utils';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useMemo} from 'react';

export function useJourneyModes(): Modes {
  const {
    isFlexibleTransportEnabled,
    isFlexibleTransportOnAccessModeEnabled,
    isFlexibleTransportOnDirectModeEnabled,
    isFlexibleTransportOnEgressModeEnabled,
    isNonTransitTripSearchEnabled,
  } = useFeatureTogglesContext();

  return useMemo(
    () => ({
      accessMode:
        isFlexibleTransportEnabled && isFlexibleTransportOnAccessModeEnabled
          ? StreetMode.Flexible
          : defaultJourneyModes.accessMode,
      directMode:
        isFlexibleTransportEnabled && isFlexibleTransportOnDirectModeEnabled
          ? StreetMode.Flexible
          : isNonTransitTripSearchEnabled
            ? undefined
            : defaultJourneyModes.directMode,
      egressMode:
        isFlexibleTransportEnabled && isFlexibleTransportOnEgressModeEnabled
          ? StreetMode.Flexible
          : defaultJourneyModes.egressMode,
    }),
    [
      isFlexibleTransportEnabled,
      isFlexibleTransportOnAccessModeEnabled,
      isFlexibleTransportOnDirectModeEnabled,
      isFlexibleTransportOnEgressModeEnabled,
      isNonTransitTripSearchEnabled,
    ],
  );
}
