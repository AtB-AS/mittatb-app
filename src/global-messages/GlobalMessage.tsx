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

type Props = {
  globalMessageContext?: GlobalMessageContextType;
  style?: StyleProp<ViewStyle>;
};

const GlobalMessage = ({globalMessageContext, style}: Props) => {
  const {language} = useTranslation();
  const {
    findGlobalMessages,
    dismissedGlobalMessages,
    addDismissedGlobalMessages,
  } = useGlobalMessagesState();

  const globalMessages = globalMessageContext
    ? findGlobalMessages(globalMessageContext)
    : undefined;

  if (!globalMessages?.length) {
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
        .filter(isNotADismissedMessage)
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
                globalMessage.isDismissable
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
