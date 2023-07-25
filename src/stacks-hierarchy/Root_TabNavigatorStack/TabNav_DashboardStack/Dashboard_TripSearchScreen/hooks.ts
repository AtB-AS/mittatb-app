import {Location} from '@atb/favorites';
import {Leg} from '@atb/api/types/trips';
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
import {
  AvailableTripPattern,
  BookingRequirement,
  TripPatternWithKey,
} from '../types';

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

// move defaultBookingRequirement right next to type declaration?
const defaultBookingRequirement: BookingRequirement = {
  requiresBooking: false,
  requiresBookingUrgently: false,
  isTooLate: false,
  isTooEarly: false,
  secondsRemainingToDeadline: Infinity,
  latestBookingDate: new Date(Number.MAX_VALUE),
};

export function getBookingRequirementForLeg(
  leg: Leg | undefined,
  now: number,
): BookingRequirement {
  if (leg === undefined) {
    return defaultBookingRequirement;
  }

  let {
    requiresBooking,
    requiresBookingUrgently,
    isTooEarly,
    isTooLate,
    secondsRemainingToDeadline,
    latestBookingDate,
  } = defaultBookingRequirement;

  requiresBooking = isLegFlexibleTransport(leg);

  if (requiresBooking) {
    latestBookingDate = getLatestBookingDate(
      leg.bookingArrangements?.latestBookingTime,
      leg.expectedStartTime,
    );

    secondsRemainingToDeadline = (latestBookingDate.getTime() - now) / 1000;
    const secondsInOneHour = 60 * 60;
    const secondsInOneWeek = 7 * 24 * secondsInOneHour;
    if (secondsRemainingToDeadline < 0) {
      isTooLate = true;
    } else if (secondsRemainingToDeadline < secondsInOneHour) {
      requiresBookingUrgently = true;
    } else if (secondsRemainingToDeadline > secondsInOneWeek) {
      isTooEarly = true;
    }
  }

  return {
    requiresBooking,
    requiresBookingUrgently,
    isTooEarly,
    isTooLate,
    secondsRemainingToDeadline,
    latestBookingDate,
  };
}

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
