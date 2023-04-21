import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useFlexibleTransportAccessModeEnabled = () => {
  const [debugOverride] = useFlexibleTransportAccessModeDebugOverride();
  const {use_flexible_on_accessMode: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useFlexibleTransportAccessModeDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportAccessModeDebugOverride,
  );
};
