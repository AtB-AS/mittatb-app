import React from 'react';
import {useTranslation} from '@atb/translations';
import {
  GlobalMessage,
  GlobalMessageContext,
  useGlobalMessagesState,
} from '@atb/global-messages/GlobalMessagesContext';
import MessageBox from '@atb/components/message-box';
import {getReferenceDataText} from '@atb/reference-data/utils';
import {StyleProp, ViewStyle} from 'react-native';

type Props = {
  globalMessageContext?: GlobalMessageContext;
  style?: StyleProp<ViewStyle>;
};

const GlobalMessageBox = ({globalMessageContext, style}: Props) => {
  const {language} = useTranslation();
  const {findGlobalMessages} = useGlobalMessagesState();

  const globalMessages = globalMessageContext
    ? findGlobalMessages(globalMessageContext)
    : undefined;

  if (!globalMessages?.length) {
    return null;
  }

  return (
    <>
      {globalMessages.map((globalMessage: GlobalMessage) => (
        <MessageBox
          key={globalMessage.id}
          containerStyle={style}
          title={getReferenceDataText(globalMessage.title ?? [], language)}
          message={getReferenceDataText(globalMessage.body, language)}
          type={globalMessage.type}
          isMarkdown={true}
        />
      ))}
    </>
  );
};

export default GlobalMessageBox;
