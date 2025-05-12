import {MessageInfoText} from '@atb/components/message-info-text';
import {Statuses, StyleSheet, Theme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {formatToShortDateWithYear} from '@atb/utils/date';
import {addDays, parseISO} from 'date-fns';
import {View} from 'react-native';
import {RecurringPayment} from '../ticketing';

export const ExpiryMessage = ({
  recurringPayment,
}: {
  recurringPayment?: RecurringPayment;
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const now = Date.now();
  const inThirtyDays = addDays(now, 30).getTime();

  if (!recurringPayment) return null;

  const expiresAt = parseISO(recurringPayment.expiresAt).getTime();
  const cardExpiresAt = parseISO(recurringPayment.cardExpiresAt).getTime();

  let message: {type: Statuses; message: string} | null = null;

  // Check expired states first (highest priority)
  if (cardExpiresAt < now) {
    message = {
      type: 'error',
      message: t(PaymentMethodsTexts.expiryMessages.cardExpired),
    };
  } else if (expiresAt < now) {
    message = {
      type: 'error',
      message: t(PaymentMethodsTexts.expiryMessages.cardRegistrationExpired),
    };
  }
  // Then check "expiring soon" states - show the one that expires first
  else if (cardExpiresAt < inThirtyDays || expiresAt < inThirtyDays) {
    // Compare which one expires first
    if (cardExpiresAt < expiresAt) {
      message = {
        type: 'warning',
        message: t(
          PaymentMethodsTexts.expiryMessages.cardExpiring(
            formatToShortDateWithYear(recurringPayment.cardExpiresAt, language),
          ),
        ),
      };
    } else {
      message = {
        type: 'warning',
        message: t(
          PaymentMethodsTexts.expiryMessages.cardRegistrationExpiring(
            formatToShortDateWithYear(recurringPayment.expiresAt, language),
          ),
        ),
      };
    }
  }

  if (!message) return null;

  return (
    <View style={styles.warningMessage}>
      <MessageInfoText type={message.type} message={message.message} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  warningMessage: {
    paddingTop: theme.spacing.medium,
  },
}));
