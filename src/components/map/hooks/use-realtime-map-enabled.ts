import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';

export const useRealtimeMapEnabled = () => {
  const [debugOverride] = useRealtimeMapDebugOverride();
  const {enable_realtime_map: enabledInRemoteConfig} = useRemoteConfig();
  const screenReaderEnabled = useIsScreenReaderEnabled();
  if (screenReaderEnabled) {
    return false;
  }
  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useRealtimeMapDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableRealtimeMapDebugOverride);
};
