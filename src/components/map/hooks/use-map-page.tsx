import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useMapPage = () => {
  const {enable_map_page} = useRemoteConfig();
  const [debugOverride] = useMapDebugOverride();
  return debugOverride !== undefined ? debugOverride : enable_map_page;
};

export const useMapDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableMapDebugOverride);
};
