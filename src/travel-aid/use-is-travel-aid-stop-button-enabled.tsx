import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsTravelAidStopButtonEnabled = () => {
  const {enable_travel_aid_stop_button} = useRemoteConfig();
  const [debugOverride, _, debugOverrideReady] =
    useIsTravelAidStopButtonEnabledDebugOverride();
  return [
    debugOverride !== undefined ? debugOverride : enable_travel_aid_stop_button,
    debugOverrideReady,
  ];
};

export const useIsTravelAidStopButtonEnabledDebugOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableTravelAidStopButton);
};
