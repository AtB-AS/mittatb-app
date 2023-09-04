import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useLoadingScreenEnabled = () => {
  const {enable_loading_screen} = useRemoteConfig();
  const [debugOverride] = useLoadingScreenEnabledDebugOverride();
  return debugOverride !== undefined ? debugOverride : enable_loading_screen;
};

export const useLoadingScreenEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableLoadingScreenDebugOverride,
  );
};
