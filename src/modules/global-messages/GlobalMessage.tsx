import React from 'react';
import {useTranslation} from '@atb/translations';
import {useGlobalMessagesContext} from './GlobalMessagesContext';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleProp, ViewStyle} from 'react-native';
import {GlobalMessageContextEnum, GlobalMessageType} from './types';
import {getTextForLanguage} from '@atb/translations';
import {useNow} from '@atb/utils/use-now';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {RuleVariables} from '@atb/rule-engine/rules';
import {ContrastColor, TextColor} from '@atb/theme/colors';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useAuthContext} from '@atb/auth';

type Props = {
  globalMessageContext?: GlobalMessageContextEnum;
  style?: StyleProp<ViewStyle>;
  includeDismissed?: boolean;
  ruleVariables?: RuleVariables;
  textColor: ContrastColor | TextColor;
};

const GlobalMessage = ({
  globalMessageContext,
  style,
  includeDismissed,
  ruleVariables,
  textColor,
}: Props) => {
  const {language} = useTranslation();
  const now = useNow(2500);
  const {authenticationType} = useAuthContext();
  const {
    findGlobalMessages,
    dismissedGlobalMessages,
    addDismissedGlobalMessages,
  } = useGlobalMessagesContext();

  if (!globalMessageContext) return null;

  const globalRuleVariables: RuleVariables = {
    authenticationType,
  };

  const globalMessages = findGlobalMessages(globalMessageContext, {
    ...ruleVariables,
    ...globalRuleVariables,
  });

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
          const link = getTextForLanguage(globalMessage.link, language);
          const linkText = getTextForLanguage(globalMessage.linkText, language);
          const onPressAction = link
            ? {text: linkText ? linkText : link, url: link}
            : undefined;
          if (!message) return null;

          return globalMessage.subtle ? (
            <MessageInfoText
              key={globalMessage.id}
              type={globalMessage.type}
              message={message}
              textColor={textColor}
              isMarkdown={true}
              style={style}
              testID="globalMessage"
            />
          ) : (
            <MessageInfoBox
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
              onPressConfig={onPressAction}
              testID="globalMessage"
            />
          );
        })}
    </>
  );
};

export {GlobalMessage};
