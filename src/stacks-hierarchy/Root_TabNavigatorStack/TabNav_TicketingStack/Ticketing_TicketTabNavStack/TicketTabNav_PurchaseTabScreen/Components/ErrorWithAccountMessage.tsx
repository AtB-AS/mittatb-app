import {useAuthState} from '@atb/auth';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleProp, ViewStyle} from 'react-native';
import {useAnalytics} from '@atb/analytics';

type Props = {style?: StyleProp<ViewStyle>};

export const ErrorWithAccountMessage = ({style}: Props) => {
  const {authStatus, retryAuth} = useAuthState();
  const {t} = useTranslation();
  const {logEvent} = useAnalytics();
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
