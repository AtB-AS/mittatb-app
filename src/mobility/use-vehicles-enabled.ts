import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsVehiclesEnabled = () => {
  const [debugOverride] = useVehiclesInMapDebugOverride();
  const {enable_vehicles_in_map: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};
export const useVehiclesInMapDebugOverride = (): [
  boolean | undefined,
  (v?: boolean) => void,
  boolean,
] => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableVehiclesInMapDebugOverride,
  );
};
