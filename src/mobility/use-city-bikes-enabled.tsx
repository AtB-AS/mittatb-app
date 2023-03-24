import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsCityBikesEnabled = () => {
  const [debugOverride] = useCityBikesInMapDebugOverride();
  const {enable_city_bikes_in_map: enabledInRemoteConfig} = useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};
export const useCityBikesInMapDebugOverride = (): [
  boolean | undefined,
  (v?: boolean) => void,
] => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableCityBikesInMapDebugOverride,
  );
};
