import {MessageInfoText} from '@atb/components/message-info-text';
import {Statuses, StyleSheet, Theme} from '@atb/theme';
import {Language, TranslateFunction, useTranslation} from '@atb/translations';
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
  const styles = useStyles();

  const message: {type: Statuses; message: string} | null =
    useMessage(recurringPayment);

  if (!message) return null;

  return (
    <View style={styles.warningMessage}>
      <MessageInfoText type={message.type} message={message.message} />
    </View>
  );
};

const useMessage = (
  recurringPayment?: RecurringPayment,
): {type: Statuses; message: string} | null => {
  const {t, language} = useTranslation();

  return getExpiryMessageInfo(recurringPayment, t, language);
};

const getExpiryMessageInfo = (
  recurringPayment: RecurringPayment | undefined,
  t: TranslateFunction,
  language: Language,
): {type: Statuses; message: string} | null => {
  if (!recurringPayment) return null;

  const now = Date.now();
  const inThirtyDays = addDays(now, 30).getTime();
  const expiresAt = parseISO(recurringPayment.expiresAt).getTime();
  const cardExpiresAt = parseISO(recurringPayment.cardExpiresAt).getTime();

  // Check expired states first (highest priority)
  if (cardExpiresAt < now) {
    return {
      type: 'error',
      message: t(PaymentMethodsTexts.expiryMessages.cardExpired),
    };
  } else if (expiresAt < now) {
    return {
      type: 'error',
      message: t(PaymentMethodsTexts.expiryMessages.cardRegistrationExpired),
    };
  }

  // Then check "expiring soon" states - show the one that expires first
  else if (cardExpiresAt < inThirtyDays || expiresAt < inThirtyDays) {
    // Compare which one expires first
    if (cardExpiresAt < expiresAt) {
      return {
        type: 'warning',
        message: t(
          PaymentMethodsTexts.expiryMessages.cardExpiring(
            formatToShortDateWithYear(recurringPayment.cardExpiresAt, language),
          ),
        ),
      };
    } else {
      return {
        type: 'warning',
        message: t(
          PaymentMethodsTexts.expiryMessages.cardRegistrationExpiring(
            formatToShortDateWithYear(recurringPayment.expiresAt, language),
          ),
        ),
      };
    }
  }

  return null;
};

export const getExpiryMessageText = (
  recurringPayment: RecurringPayment | undefined,
  t: TranslateFunction,
  language: Language,
): string | null => {
  const messageInfo = getExpiryMessageInfo(recurringPayment, t, language);
  return messageInfo ? messageInfo.message : null;
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  warningMessage: {
    paddingTop: theme.spacing.medium,
  },
}));
