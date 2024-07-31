import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsSaveTicketRecipientsEnabled = () => {
  const {enable_save_ticket_recipients} = useRemoteConfig();
  const [debugOverride, _, _debugOverrideReady] =
    useSaveTicketRecipientsDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_save_ticket_recipients;
};

export const useSaveTicketRecipientsDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableSaveTicketRecipientsDebugOverride,
  );
};
