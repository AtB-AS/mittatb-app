import {Location} from '@atb/modules/favorites';
import {CityZone} from '@atb/modules/configuration';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {useMemo} from 'react';
import {
  Modes,
  StreetMode,
} from '@atb/api/types/generated/journey_planner_v3_types';

import {defaultJourneyModes} from './utils';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useFindCityZoneInLocation = (
  location: Location | undefined,
  cityZones?: CityZone[],
) => {
  return useMemo(() => {
    if (location?.coordinates.latitude && cityZones) {
      return cityZones.find(({geometry}) =>
        turfBooleanPointInPolygon(
          [location?.coordinates.longitude, location?.coordinates.latitude],
          geometry,
        ),
      );
    }
  }, [
    cityZones,
    location?.coordinates.longitude,
    location?.coordinates.latitude,
  ]);
};

export function useJourneyModes(): Modes {
  const {
    isFlexibleTransportEnabled,
    isFlexibleTransportOnAccessModeEnabled,
    isFlexibleTransportOnDirectModeEnabled,
    isFlexibleTransportOnEgressModeEnabled,
    isNonTransitTripSearchEnabled,
  } = useFeatureTogglesContext();

  return {
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
  };
}
