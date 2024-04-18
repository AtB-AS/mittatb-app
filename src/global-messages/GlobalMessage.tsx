import React from 'react';
import {useTranslation} from '@atb/translations';
import {useGlobalMessagesState} from '@atb/global-messages/GlobalMessagesContext';
import {MessageInfoBox, OnPressConfig} from '@atb/components/message-info-box';
import {StyleProp, ViewStyle} from 'react-native';
import {
  GlobalMessageContextEnum,
  GlobalMessageType,
} from '@atb/global-messages/types';
import {getTextForLanguage} from '@atb/translations';
import {useNow} from '@atb/utils/use-now';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {RuleVariables} from '../rule-engine/rules';
import {StaticColor, TextColor} from '@atb/theme/colors';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

type Props = {
  globalMessageContext?: GlobalMessageContextEnum;
  style?: StyleProp<ViewStyle>;
  includeDismissed?: boolean;
  ruleVariables?: RuleVariables;
  textColor: StaticColor | TextColor;
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
  const {
    findGlobalMessages,
    dismissedGlobalMessages,
    addDismissedGlobalMessages,
  } = useGlobalMessagesState();

  const isScreenReaderEnabled = useIsScreenReaderEnabled();

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
          const displayMessageAndAction = getMessageAndAction(
            message,
            isScreenReaderEnabled,
          );

          return (
            <>
              {globalMessage.subtle ? (
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
                  title={getTextForLanguage(
                    globalMessage.title ?? [],
                    language,
                  )}
                  message={displayMessageAndAction.message}
                  type={globalMessage.type}
                  isMarkdown={true}
                  onDismiss={
                    globalMessage.isDismissable && !includeDismissed
                      ? () => dismissGlobalMessage(globalMessage)
                      : undefined
                  }
                  onPressConfig={displayMessageAndAction.action}
                  isInlineOnPressText={isScreenReaderEnabled}
                  testID="globalMessage"
                />
              )}
            </>
          );
        })}
    </>
  );
};

const markdownLinkRegex = /\[([^\[]+)\]\((.*)\)/;

const parseLink = (message: string) => {
  const parsedArray = message.match(markdownLinkRegex) || [];
  const [full, text, url] = parsedArray;
  return {full, text, url};
};

const getMessageAndAction = (
  message: string,
  isScreenReaderEnabled: boolean,
): {message: string; action: OnPressConfig | undefined} => {
  const parsedLink = parseLink(message);
  const trimmedMessage = parsedLink.full
    ? message.replace(parsedLink.full, parsedLink.text)
    : message;
  if (isScreenReaderEnabled) {
    return {
      message: parsedLink.full ? trimmedMessage : message,
      action: parsedLink
        ? {text: parsedLink.text, hideText: true, url: parsedLink.url}
        : undefined,
    };
  }

  return {
    message: message,
    action: undefined,
  };
};

export {GlobalMessage};
