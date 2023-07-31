import React from 'react';
import {useTranslation} from '@atb/translations';
import {useGlobalMessagesState} from '@atb/global-messages/GlobalMessagesContext';
import {MessageBox} from '@atb/components/message-box';
import {StyleProp, ViewStyle} from 'react-native';
import {
  GlobalMessageContextEnum,
  GlobalMessageType,
  RuleVariables,
} from '@atb/global-messages/types';
import {getTextForLanguage} from '@atb/translations';
import {useNow} from '@atb/utils/use-now';
import {isWithinTimeRange} from '@atb/global-messages/is-within-time-range';

type Props = {
  globalMessageContext?: GlobalMessageContextEnum | 'all';
  style?: StyleProp<ViewStyle>;
  includeDismissed?: boolean;
  ruleVariables?: RuleVariables;
};

const GlobalMessage = ({
  globalMessageContext,
  style,
  includeDismissed,
  ruleVariables,
}: Props) => {
  const {language} = useTranslation();
  const now = useNow(2500);
  const {
    findGlobalMessages,
    dismissedGlobalMessages,
    addDismissedGlobalMessages,
  } = useGlobalMessagesState();

  if (!globalMessageContext) return null;

  const globalMessages = findGlobalMessages(
    globalMessageContext,
    ruleVariables,
  );

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
          return includeDismissed || isNotADismissedMessage(gm);
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
                globalMessage.isDismissable && !includeDismissed
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
