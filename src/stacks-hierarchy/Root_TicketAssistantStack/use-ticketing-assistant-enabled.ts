import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';
import {usePreferences} from '@atb/preferences';

export const useTicketingAssistantEnabled = () => {
  const {enable_ticketing_assistant} = useRemoteConfig();

  const {
    preferences: {showTicketAssistant},
  } = usePreferences();
  const [debugOverride] = useTicketingAssistantDebugOverride();

  if (debugOverride) {
    return showTicketAssistant;
  }

  if (enable_ticketing_assistant) {
    return showTicketAssistant;
  }
  return false;
};

export const useTicketingAssistantDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTicketingAssistantOverride,
  );
};
