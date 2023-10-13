import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useLoadingErrorScreenEnabled = () => {
  const {enable_loading_error_screen} = useRemoteConfig();
  const [debugOverride] = useLoadingErrorScreenEnabledDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_loading_error_screen;
};

export const useLoadingErrorScreenEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableLoadingErrorScreenDebugOverride,
  );
};
