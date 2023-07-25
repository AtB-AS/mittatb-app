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
import {useNow} from '@atb/utils/use-now';
import {isLegFlexibleTransport} from '@atb/travel-details-screens/utils';
import {AvailableTripPattern, TripPatternWithKey} from '../types';

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

export const defaultJourneyModes = {
  accessMode: StreetMode.Foot,
  directMode: StreetMode.Foot,
  egressMode: StreetMode.Foot,
};

export function useJourneyModes(): [Modes, boolean] {
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
        : defaultJourneyModes.accessMode,
    directMode:
      isFlexibleTransportEnabledInRemoteConfig &&
      flexibleTransportDirectModeEnabledInRemoteConfig
        ? StreetMode.Flexible
        : defaultJourneyModes.directMode,
    egressMode:
      isFlexibleTransportEnabledInRemoteConfig &&
      flexibleTransportEgressModeEnabledInRemoteConfig
        ? StreetMode.Flexible
        : defaultJourneyModes.egressMode,
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

function getLatestBookingDate(
  latestBookingTime: string, // e.g. '15:16:00'
  expectedStartTime: string, // e.g. '2023-07-14T17:56:32+02:00'
): Date {
  const expectedStartDate = new Date(expectedStartTime);
  const latestBookingDate = new Date(
    `${expectedStartTime.split('T')[0]}T${latestBookingTime}`,
  );

  if (latestBookingDate.getTime() > expectedStartDate.getTime()) {
    latestBookingDate.setDate(latestBookingDate.getDate() - 1);
  }

  return latestBookingDate;
}

export const useAvailableTripPatterns = (
  tripPatterns: TripPatternWithKey[],
): AvailableTripPattern[] => {
  const now = useNow(2500);
  // todo: consider what if there are several flexibleTransportLegs?
  const tripPatternsWithBookingRequirements = tripPatterns.map(
    (tripPattern) => {
      const firstFlexibleTransportLeg = tripPattern?.legs.find((leg) =>
        isLegFlexibleTransport(leg),
      );
      const requiresBooking = !!firstFlexibleTransportLeg;

      let requiresBookingUrgently = false;
      let isTooEarly = false;
      let isTooLate = false;

      if (requiresBooking) {
        const latestBookingDate = getLatestBookingDate(
          firstFlexibleTransportLeg.bookingArrangements?.latestBookingTime,
          firstFlexibleTransportLeg.expectedStartTime,
        );

        const timeDiffMilliSeconds = latestBookingDate.getTime() - now;
        const oneHourMilliSeconds = 60 * 60 * 1000;
        if (timeDiffMilliSeconds < 0) {
          isTooLate = true; // currently assuming bookWhen == 'advanceAndDayOfTravel'
        } else if (timeDiffMilliSeconds < oneHourMilliSeconds) {
          requiresBookingUrgently = true;
        } else if (timeDiffMilliSeconds > 7 * 24 * oneHourMilliSeconds) {
          isTooEarly = true;
        }
      }

      const bookingRequirement = {
        requiresBooking,
        requiresBookingUrgently,
        isTooEarly,
        isTooLate,
      };
      return {
        ...tripPattern,
        ...{bookingRequirement},
      };
    },
  );

  return tripPatternsWithBookingRequirements.filter(
    (tpwbr) => !tpwbr.bookingRequirement.isTooLate,
  );
};
