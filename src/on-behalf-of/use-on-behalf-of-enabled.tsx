import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useOnBehalfOfEnabled = () => {
  const {enable_on_behalf_of} = useRemoteConfig();
  const [debugOverride] = useOnBehalfOfEnabledDebugOverride();
  return debugOverride !== undefined ? debugOverride : enable_on_behalf_of;
};

export const useOnBehalfOfEnabledDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableOnBehalfOfDebugOverride);
};
