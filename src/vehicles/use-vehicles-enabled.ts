import {useRemoteConfig} from '@atb/RemoteConfigContext';

export const useIsVehiclesEnabled = () => {
  const {enable_vehicles_in_map: enabledInRemoteConfig} = useRemoteConfig();
  return enabledInRemoteConfig;
};
