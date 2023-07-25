import {Location} from '@atb/favorites';
import {CityZone} from '@atb/reference-data/types';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {useMemo} from 'react';
import {
  Modes,
  StreetMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {useFlexibleTransportEnabled} from './use-flexible-transport-enabled';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {RemoteConfigKeys} from '@atb/remote-config';
import {TripPatternWithKey} from '@atb/travel-details-screens/types';
import {
  isLegFlexibleTransport,
  getBookingRequirementForLeg,
} from '@atb/travel-details-screens/utils';
import {useNow} from '@atb/utils/use-now';
import {AvailableTripPattern} from '../types';

export const useFindCityZoneInLocation = (
  location: Location | undefined,
  cityZones?: CityZone[],
) => {
  return useMemo(() => {
    if (location && cityZones) {
      const {longitude, latitude} = location.coordinates;
      return cityZones.find(({geometry}) =>
        turfBooleanPointInPolygon([longitude, latitude], geometry),
      );
    }
  }, [
    cityZones,
    location?.coordinates.longitude,
    location?.coordinates.latitude,
  ]);
};

export function useJourneyModes(
  defaultValue: StreetMode = StreetMode.Foot,
): [Modes, boolean] {
  const [
    isFlexibleTransportEnabledInRemoteConfig,
    flexTransportDebugOverrideReady,
  ] = useFlexibleTransportEnabled();
  const [
    flexibleTransportAccessModeEnabledInRemoteConfig,
    flexAccessModeDebugOverrideReady,
  ] = useFlexibleTransportAccessModeEnabled();

  const [
    flexibleTransportDirectModeEnabledInRemoteConfig,
    flexDirectModeDebugOverrideReady,
  ] = useFlexibleTransportDirectModeEnabled();
  const [
    flexibleTransportEgressModeEnabledInRemoteConfig,
    flexEgressModeDebugOverrideReady,
  ] = useFlexibleTransportEgressModeEnabled();

  const journeyModes = {
    accessMode:
      isFlexibleTransportEnabledInRemoteConfig &&
      flexibleTransportAccessModeEnabledInRemoteConfig
        ? StreetMode.Flexible
        : defaultValue,
    directMode:
      isFlexibleTransportEnabledInRemoteConfig &&
      flexibleTransportDirectModeEnabledInRemoteConfig
        ? StreetMode.Flexible
        : defaultValue,
    egressMode:
      isFlexibleTransportEnabledInRemoteConfig &&
      flexibleTransportEgressModeEnabledInRemoteConfig
        ? StreetMode.Flexible
        : defaultValue,
  };

  const allDebugOverridesReady =
    flexTransportDebugOverrideReady &&
    flexAccessModeDebugOverrideReady &&
    flexDirectModeDebugOverrideReady &&
    flexEgressModeDebugOverrideReady;

  return [journeyModes, allDebugOverridesReady];
}

export const useFlexibleTransportDebugOverrideOrRemote = (
  remoteConfigKey: RemoteConfigKeys,
  storageModelKey: StorageModelKeysEnum,
): [string | number | boolean, boolean] => {
  const [debugOverride, _, debugOverrideValueReady] =
    useDebugOverride(storageModelKey);
  const remoteConfig = useRemoteConfig();

  return [
    debugOverride === undefined ? remoteConfig[remoteConfigKey] : debugOverride,
    debugOverrideValueReady,
  ];
};

export const useFlexibleTransportAccessModeEnabled = () => {
  return useFlexibleTransportDebugOverrideOrRemote(
    'use_flexible_on_accessMode',
    StorageModelKeysEnum.UseFlexibleTransportAccessModeDebugOverride,
  );
};

export const useFlexibleTransportDirectModeEnabled = () => {
  return useFlexibleTransportDebugOverrideOrRemote(
    'use_flexible_on_directMode',
    StorageModelKeysEnum.UseFlexibleTransportDirectModeDebugOverride,
  );
};

export const useFlexibleTransportEgressModeEnabled = () => {
  return useFlexibleTransportDebugOverrideOrRemote(
    'use_flexible_on_egressMode',
    StorageModelKeysEnum.UseFlexibleTransportEgressModeDebugOverride,
  );
};

export const useAvailableTripPatterns = (
  tripPatterns: TripPatternWithKey[],
): AvailableTripPattern[] => {
  const now = useNow(2500);

  const tripPatternsWithBookingRequirements = tripPatterns.map(
    (tripPattern) => {
      // if > 1 flexible transport leg, just use the first one
      const firstFlexibleTransportLeg = tripPattern?.legs.find((leg) =>
        isLegFlexibleTransport(leg),
      );

      const bookingRequirement = getBookingRequirementForLeg(
        firstFlexibleTransportLeg,
        now,
      );

      return {
        ...tripPattern,
        ...{bookingRequirement},
      };
    },
  );

  return tripPatternsWithBookingRequirements.filter(
    (tpwbr) => !tpwbr.bookingRequirement?.isTooLate,
  );
};
