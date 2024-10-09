import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsTravelAidEnabled = () => {
  const {enable_travel_aid} = useRemoteConfig();
  const [debugOverride, _, debugOverrideReady] =
    useIsTravelAidEnabledDebugOverride();
  return [
    debugOverride !== undefined ? debugOverride : enable_travel_aid,
    debugOverrideReady,
  ];
};

export const useIsTravelAidEnabledDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableTravelAid);
};
