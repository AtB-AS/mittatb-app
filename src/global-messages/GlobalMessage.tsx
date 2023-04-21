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
import {isWithinTimeRange} from '@atb/global-messages/is-within-time-range';

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
  const isNotADismissedMessage = (globalMessage: GlobalMessageType) =>
    !globalMessage.isDismissable ||
    dismissedGlobalMessages.map((dga) => dga.id).indexOf(globalMessage.id) < 0;

  return (
    <>
      {globalMessages
        .filter((gm: GlobalMessageType) => {
          return showAllMessages || isNotADismissedMessage(gm);
        })
        .filter((gm) => isWithinTimeRange(gm, now))
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
