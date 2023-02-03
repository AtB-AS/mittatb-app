import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useNewTravelSearchEnabled = () => {
  const [debugOverride] = useNewTravelSearchDebugOverride();
  const {enable_new_travel_search: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useNewTravelSearchDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableNewTravelSearchDebugOverride,
  );
};
