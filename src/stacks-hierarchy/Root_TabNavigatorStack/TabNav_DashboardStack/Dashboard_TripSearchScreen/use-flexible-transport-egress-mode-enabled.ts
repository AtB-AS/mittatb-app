import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useFlexibleTransportEgressModeEnabled = () => {
  const [debugOverride] = useFlexibleTransportEgressModeDebugOverride();
  const {use_flexible_on_egressMode: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useFlexibleTransportEgressModeDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportEgressModeDebugOverride,
  );
};
