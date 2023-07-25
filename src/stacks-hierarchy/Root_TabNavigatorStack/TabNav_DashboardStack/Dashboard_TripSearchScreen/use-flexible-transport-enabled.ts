import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useFlexibleTransportEnabled = () => {
  const [debugOverride, _, debugOverrideReady] =
    useFlexibleTransportDebugOverride();
  const {enable_flexible_transport: enabledInRemoteConfig} = useRemoteConfig();

  return [
    debugOverride === undefined ? enabledInRemoteConfig : debugOverride,
    debugOverrideReady,
  ];
};

export const useFlexibleTransportDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableFlexibleTransportDebugOverride,
  );
};
