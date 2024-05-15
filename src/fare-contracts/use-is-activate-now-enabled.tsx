import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsActivateTicketNowEnabled = () => {
  const {enable_activate_ticket_now} = useRemoteConfig();
  const [debugOverride, _, _debugOverrideReady] =
    useActivateTicketNowEnabledDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_activate_ticket_now;
};

export const useActivateTicketNowEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableActivateTicketNowDebugOverride,
  );
};
