import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsBeaconsEnabled = () => {
  const {enable_beacons} = useRemoteConfig();
  const [debugOverride] = useBeaconsEnabledDebugOverride();
  return debugOverride !== undefined ? debugOverride : enable_beacons;
};

export const useBeaconsEnabledDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableBeaconsDebugOverride);
};
