import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useServerTimeEnabled = () => {
  const [debugOverride, _, debugOverrideReady] =
      useServerTimeEnabledDebugOverride();
  const {enable_server_time: enabledInRemoteConfig} = useRemoteConfig();

  return [
    debugOverride === undefined ? enabledInRemoteConfig : debugOverride,
    debugOverrideReady,
  ];
};

export const useServerTimeEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableServerTimeDebugOverride,
  );
};
