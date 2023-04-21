import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useFlexibleTransportDirectModeEnabled = () => {
  const [debugOverride] = useFlexibleTransportDirectModeDebugOverride();
  const {use_flexible_on_directMode: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useFlexibleTransportDirectModeDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportDirectModeDebugOverride,
  );
};
