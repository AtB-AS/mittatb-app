import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsBackendSmsAuthEnabled = () => {
  const {enable_backend_sms_auth} = useRemoteConfig();
  const [debugOverride] = useBackendSmsAuthEnabledDebugOverride();
  return debugOverride !== undefined ? debugOverride : enable_backend_sms_auth;
};

export const useBackendSmsAuthEnabledDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableBackendSmsAuth);
};
