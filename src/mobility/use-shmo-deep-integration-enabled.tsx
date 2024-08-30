import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useShmoDeepIntegrationEnabled = () => {
  const [debugOverride, _, debugOverrideReady] =
    useShmoDeepIntegrationDebugOverride();
  const {enable_shmo_deep_integration: enabledInRemoteConfig} =
    useRemoteConfig();

  return [
    debugOverride === undefined ? enabledInRemoteConfig : debugOverride,
    debugOverrideReady,
  ];
};

export const useShmoDeepIntegrationDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableShmoDeepIntegrationDebugOverride,
  );
};
