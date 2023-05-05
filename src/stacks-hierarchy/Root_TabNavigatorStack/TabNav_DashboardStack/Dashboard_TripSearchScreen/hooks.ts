import {useFirestoreConfiguration} from '@atb/configuration';
import {Location} from '@atb/favorites';
import {CityZone} from '@atb/reference-data/types';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
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

export const useFindCityZonesInLocations = (
  from: Location | undefined,
  to: Location | undefined,
): CityZone[] | undefined => {
  const {cityZones} = useFirestoreConfiguration();
  const fromCityZone = useFindCityZoneInLocation(from, cityZones);
  const toCityZone = useFindCityZoneInLocation(to, cityZones);

  return [fromCityZone, toCityZone]
    .filter((cityZone): cityZone is CityZone => !!cityZone?.enabled)
    .filter(onlyUniquesBasedOnField('name'));
};

export function useJourneyModes(
  defaultValue: StreetMode = StreetMode.Foot,
): Modes {
  const flexibleTransportEnabled = useFlexibleTransportEnabled();
  const flexibleTransportAccessModeEnabled =
    useFlexibleTransportAccessModeEnabled();
  const flexibleTransportDirectModeEnabled =
    useFlexibleTransportDirectModeEnabled();
  const flexibleTransportEgressModeEnabled =
    useFlexibleTransportEgressModeEnabled();

  return {
    accessMode:
      flexibleTransportEnabled && flexibleTransportAccessModeEnabled
        ? StreetMode.Flexible
        : defaultValue,
    directMode:
      flexibleTransportEnabled && flexibleTransportDirectModeEnabled
        ? StreetMode.Flexible
        : defaultValue,
    egressMode:
      flexibleTransportEnabled && flexibleTransportEgressModeEnabled
        ? StreetMode.Flexible
        : defaultValue,
  };
}

export const useFlexibleTransportDebugOverrideOrRemote = (
  remoteConfigKey: RemoteConfigKeys,
  storageModelKey: StorageModelKeysEnum,
) => {
  const [debugOverride] = useDebugOverride(storageModelKey);
  const remoteConfig = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }

  return remoteConfig[remoteConfigKey];
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
