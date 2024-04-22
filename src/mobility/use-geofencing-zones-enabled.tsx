import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useGeofencingZonesEnabled = () => {
  const [debugOverride, _, debugOverrideReady] =
    useGeofencingZonesDebugOverride();
  const {enable_geofencing_zones: enabledInRemoteConfig} = useRemoteConfig();

  return [
    debugOverride === undefined ? enabledInRemoteConfig : debugOverride,
    debugOverrideReady,
  ];
};

export const useGeofencingZonesDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableGeofencingZonesDebugOverride,
  );
};
