import React from 'react';
import {useTranslation} from '@atb/translations';
import {useGlobalMessagesState} from '@atb/global-messages/GlobalMessagesContext';
import {MessageBox} from '@atb/components/message-box';
import {StyleProp, ViewStyle} from 'react-native';
import {
  GlobalMessageContextType,
  GlobalMessageType,
} from '@atb/global-messages/types';
import {getTextForLanguage} from '@atb/translations';
import {useNow} from '@atb/utils/use-now';

type Props = {
  globalMessageContext?: GlobalMessageContextType;
  style?: StyleProp<ViewStyle>;
  showAllMessages?: boolean;
};

const GlobalMessage = ({
  globalMessageContext,
  style,
  showAllMessages = false,
}: Props) => {
  const {language} = useTranslation();
  const now = useNow(2500);
  const {
    findGlobalMessages,
    dismissedGlobalMessages,
    addDismissedGlobalMessages,
  } = useGlobalMessagesState();

  // If `showAllMessages` is true, retrieve all global messages using `findGlobalMessages()`.
  // Otherwise, check if a specific `globalMessageContext` is provided. If it is, retrieve the corresponding global messages using `findGlobalMessages(globalMessageContext)`.
  // If no `globalMessageContext` is provided, default to an empty array.
  const globalMessages = showAllMessages
    ? findGlobalMessages()
    : globalMessageContext
    ? findGlobalMessages(globalMessageContext)
    : [];

  if (globalMessages.length === 0 && !showAllMessages) {
    return null;
  }

  const dismissGlobalMessage = (globalMessage: GlobalMessageType) => {
    globalMessage.isDismissable && addDismissedGlobalMessages(globalMessage);
  };

  const isWithinTimeRange = (globalMessage: GlobalMessageType) => {
    const startDate = globalMessage.startDate ?? 0;
    const endDate = globalMessage.endDate ?? 8640000000000000;

    return startDate <= now && endDate >= now;
  };

  const isNotADismissedMessage = (globalMessage: GlobalMessageType) =>
    !globalMessage.isDismissable ||
    dismissedGlobalMessages.map((dga) => dga.id).indexOf(globalMessage.id) < 0;

  return (
    <>
      {globalMessages
        .filter((gm: GlobalMessageType) => {
          return showAllMessages || isNotADismissedMessage(gm);
        })
        .filter(isWithinTimeRange)
        .map((globalMessage: GlobalMessageType) => {
          const message = getTextForLanguage(globalMessage.body, language);
          if (!message) return null;
          return (
            <MessageBox
              key={globalMessage.id}
              style={style}
              title={getTextForLanguage(globalMessage.title ?? [], language)}
              message={message}
              type={globalMessage.type}
              isMarkdown={true}
              onDismiss={
                globalMessage.isDismissable && !showAllMessages
                  ? () => dismissGlobalMessage(globalMessage)
                  : undefined
              }
            />
          );
        })}
    </>
  );
};

export {GlobalMessage};
