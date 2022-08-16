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
import {Theme, useTheme} from '@atb/theme';

type GlobalMessageWithMarkdown = {
  lang: string;
  value: string;
  valueWithMarkdown?: string;
};

type Props = {
  globalMessageContext?: GlobalMessageContext;
  style?: StyleProp<ViewStyle>;
};

const GlobalMessageBox = ({globalMessageContext, style}: Props) => {
  const {language} = useTranslation();
  const {theme} = useTheme();
  const {findGlobalMessage} = useGlobalMessagesState();

  const globalMessage = globalMessageContext
    ? findGlobalMessage(globalMessageContext)
    : undefined;

  if (
    !globalMessage ||
    !Object.keys(theme.static.status).includes(globalMessage.type)
  ) {
    return null;
  }

  return (
    <MessageBox
      containerStyle={style}
      title={getReferenceDataText(globalMessage.title ?? [], language)}
      message={getReferenceDataText(
        markdownPreferredText(globalMessage.body),
        language,
      )}
      type={globalMessage.type}
      isMarkdown={true}
    />
  );
};

const markdownPreferredText = (
  globalMessagesWithMarkdown: GlobalMessageWithMarkdown[],
) =>
  globalMessagesWithMarkdown.map((item) => {
    return {lang: item.lang, value: item.valueWithMarkdown || item.value};
  });

const isValidAlert = (theme: Theme, globalMessage?: GlobalMessage) => {
  if (!globalMessage) return false;
  return Object.keys(theme.static.status).includes(globalMessage.type);
};

export default GlobalMessageBox;
