import {useRemoteConfigContext} from '@atb/RemoteConfigContext';

export const useVehiclesPollInterval = () => {
  const {vehicles_poll_interval: pollInterval} = useRemoteConfigContext();
  return pollInterval;
};
