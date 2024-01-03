import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsPosthogEnabled = () => {
  const {enable_posthog} = useRemoteConfig();
  const [debugOverride, _, debugOverrideReady] =
    usePosthogEnabledDebugOverride();
  return [
    debugOverride !== undefined ? debugOverride : enable_posthog,
    debugOverrideReady,
  ];
};

export const usePosthogEnabledDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnablePosthogDebugOverride);
};
