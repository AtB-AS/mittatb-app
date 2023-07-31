import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useNonTransitTripSearchEnabled = () => {
  const [debugOverride, _, debugOverrideReady] =
    useNonTransitTripSearchDebugOverride();
  const {enable_non_transit_trip_search: enabledInRemoteConfig} =
    useRemoteConfig();

  return [
    debugOverride === undefined ? enabledInRemoteConfig : debugOverride,
    debugOverrideReady,
  ];
};

export const useNonTransitTripSearchDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableNonTransitTripSearch);
};
