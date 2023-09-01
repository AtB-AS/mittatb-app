import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useShowValidTimeInfoEnabled = () => {
  const [debugOverride] = useShowValidTimeInfoDebugOverride();
  const {enable_show_valid_time_info: isValidTimeInfoEnabled} =
    useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }

  return isValidTimeInfoEnabled;
};

export const useShowValidTimeInfoDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.ShowValidTimeInfoDebugOverride);
};
