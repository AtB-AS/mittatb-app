import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useTicketingAssistantEnabled = () => {
  const {enable_ticketing_assistant} = useRemoteConfig();
  const [debugOverride] = useTicketingAssistantDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_ticketing_assistant;
};

export const useTicketingAssistantDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTicketingAssistantOverride,
  );
};
