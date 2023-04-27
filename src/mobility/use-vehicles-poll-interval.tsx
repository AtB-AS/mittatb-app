import {useRemoteConfig} from '@atb/RemoteConfigContext';

export const useVehiclesPollInterval = () => {
  const {vehicles_poll_interval: pollInterval} = useRemoteConfig();
  return pollInterval;
};
