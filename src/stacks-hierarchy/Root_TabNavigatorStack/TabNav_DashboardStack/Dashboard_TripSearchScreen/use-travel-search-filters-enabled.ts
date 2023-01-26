import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useTravelSearchFiltersEnabled = () => {
  const [debugOverride] = useTravelSearchFiltersDebugOverride();
  const {enable_travel_search_filters: enabledInRemoteConfig} =
    useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useTravelSearchFiltersDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTravelSearchFiltersDebugOverride,
  );
};
