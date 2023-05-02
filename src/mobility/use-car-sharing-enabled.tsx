import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsCarSharingEnabled = () => {
  const [debugOverride] = useCarSharingInMapDebugOverride();
  const {enable_car_sharing_in_map: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};
export const useCarSharingInMapDebugOverride = (): [
  boolean | undefined,
  (v?: boolean) => void,
] => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableCarSharingInMapDebugOverride,
  );
};
