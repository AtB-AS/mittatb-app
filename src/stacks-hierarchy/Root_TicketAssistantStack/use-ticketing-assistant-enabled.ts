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

  if (debugOverride !== undefined && !debugOverride) return false;

  if (enable_ticketing_assistant == undefined) {
    return false;
  } else if (!enable_ticketing_assistant) {
    return false;
  } else {
    return showTicketAssistant;
  }
};

export const useTicketingAssistantDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTicketingAssistantOverride,
  );
};
