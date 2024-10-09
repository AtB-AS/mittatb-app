import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsTravelAidStopButtonEnabled = () => {
  const {enable_travel_aid_stop_button} = useRemoteConfig();
  const [debugOverride, _, debugOverrideReady] =
    useIsTravelAidEnabledStopButtonDebugOverride();
  return [
    debugOverride !== undefined ? debugOverride : enable_travel_aid_stop_button,
    debugOverrideReady,
  ];
};

export const useIsTravelAidEnabledStopButtonDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableTravelAidStopButton);
};
