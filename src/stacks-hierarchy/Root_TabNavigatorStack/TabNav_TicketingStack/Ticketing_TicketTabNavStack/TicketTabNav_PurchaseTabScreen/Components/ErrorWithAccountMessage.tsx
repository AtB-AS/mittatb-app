import {useAuthContext} from '@atb/modules/auth';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleProp} from 'react-native';
import {useAnalyticsContext} from '@atb/modules/analytics';
import type {MarginStyle} from '@atb/theme';

type Props = {style?: StyleProp<MarginStyle>};

export const ErrorWithAccountMessage = ({style}: Props) => {
  const {authStatus, retryAuth} = useAuthContext();
  const {t} = useTranslation();
  const {logEvent} = useAnalyticsContext();
  if (authStatus === 'authenticated') return null;

  return (
    <MessageInfoBox
      style={style}
      type="error"
      title={t(TicketingTexts.accountError.title)}
      message={t(TicketingTexts.accountError.message)}
      onPressConfig={{
        action: () => {
          logEvent('Ticketing', 'Retry auth');
          retryAuth();
        },
        text: t(TicketingTexts.accountError.actionText),
      }}
    />
  );
};
