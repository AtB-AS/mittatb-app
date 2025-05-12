import {useRemoteConfigContext} from '@atb/modules/remote-config';

export const useVehiclesPollInterval = () => {
  const {vehicles_poll_interval: pollInterval} = useRemoteConfigContext();
  return pollInterval;
};
