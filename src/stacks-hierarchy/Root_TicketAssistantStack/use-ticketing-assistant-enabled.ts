import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';
import {usePreferences} from '@atb/preferences';

export const useTicketingAssistantEnabled = () => {
  let {enable_ticketing_assistant} = useRemoteConfig();

  const {
    preferences: {showTicketAssistant},
  } = usePreferences();
  const [debugOverride] = useTicketingAssistantDebugOverride();
  if (debugOverride !== undefined) {
    enable_ticketing_assistant = debugOverride;
  }

  if (enable_ticketing_assistant) {
    return showTicketAssistant;
  } else {
    return false;
  }
};

export const useTicketingAssistantDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTicketingAssistantOverride,
  );
};
