import storage from '@atb/storage';
import {GlobalMessage} from '@atb/global-messages/GlobalMessagesContext';

export const DISMISSED_GLOBAL_MESSAGES_KEY =
  '@ATB_user_dismissed_global_messages';

export async function addDismissedMessageInStore(
  dismissedGlobalMessage: GlobalMessage,
) {
  const dismissedGlobalMessages = await getDismissedMessagesFromStore();
  dismissedGlobalMessages.push(dismissedGlobalMessage);
  setDismissedMessagesInStore(dismissedGlobalMessages);
  return dismissedGlobalMessages;
}

export async function getDismissedMessagesFromStore() {
  const dismissedGlobalMessages = await storage.get(
    DISMISSED_GLOBAL_MESSAGES_KEY,
  );
  return dismissedGlobalMessages ? JSON.parse(dismissedGlobalMessages) : [];
}

export async function setDismissedMessagesInStore(
  dismissedGlobalMessages: GlobalMessage[],
) {
  await storage.set(
    DISMISSED_GLOBAL_MESSAGES_KEY,
    JSON.stringify(dismissedGlobalMessages),
  );
}
