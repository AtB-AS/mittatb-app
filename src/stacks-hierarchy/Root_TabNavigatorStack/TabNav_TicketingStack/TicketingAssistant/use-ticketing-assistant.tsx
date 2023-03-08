import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useTicketingAssistant = () => {
  const {enable_ticketing_assistant} = useRemoteConfig();
  const [debugOverride] = useTicketingAssistantOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_ticketing_assistant;
};

export const useTicketingAssistantOverride = () => {
  return useDebugOverride(StorageModelKeysEnum.EnableTicketingAssistant);
};
