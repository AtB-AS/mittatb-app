import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useFlexibleTransportEnabled = () => {
  const [debugOverride] = useFlexibleTransportDebugOverride();
  const {enable_flexible_transport: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useFlexibleTransportDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableFlexibleTransportDebugOverride,
  );
};
