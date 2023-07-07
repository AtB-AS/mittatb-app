import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useNonTransitTripSearchEnabled = () => {
  const [debugOverride] = useNonTransitTripSearchDebugOverride();
  const {enable_non_transit_trip_search: enabledInRemoteConfig} =
    useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useNonTransitTripSearchDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableNonTransitTripSearch);
};
