import React from 'react';
import {useTranslation} from '@atb/translations';
import {useGlobalMessagesState} from '@atb/global-messages/GlobalMessagesContext';
import MessageBox from '@atb/components/message-box';
import {getReferenceDataText} from '@atb/reference-data/utils';
import {StyleProp, ViewStyle} from 'react-native';
import {
  GlobalMessageContext,
  GlobalMessageType,
} from '@atb/global-messages/types';

type Props = {
  globalMessageContext?: GlobalMessageContext;
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
        .map((globalMessage: GlobalMessageType) => (
          <MessageBox
            key={globalMessage.id}
            containerStyle={style}
            title={getReferenceDataText(globalMessage.title ?? [], language)}
            message={getReferenceDataText(globalMessage.body, language)}
            type={globalMessage.type}
            isMarkdown={true}
            isDismissable={globalMessage.isDismissable}
            onDismiss={() => dismissGlobalMessage(globalMessage)}
          />
        ))}
    </>
  );
};

export default GlobalMessage;
