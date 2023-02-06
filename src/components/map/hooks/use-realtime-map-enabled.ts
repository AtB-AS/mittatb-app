import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useRealtimeMapEnabled = () => {
  const [debugOverride, setDebugOverride] = useRealtimeMapDebugOverride();
  const {enable_realtime_map: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return [debugOverride, setDebugOverride];
  }
  return enabledInRemoteConfig;
};

export const useRealtimeMapDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableRealtimeMapDebugOverride);
};
