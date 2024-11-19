import {
  OnBehalfOfErrorCode,
  RecipientSelectionState,
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {TicketRecipientType} from '@atb/ticketing';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  OnBehalfOfTexts,
  PhoneInputTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {useGetAccountIdByPhoneMutation} from '@atb/on-behalf-of/queries/use-get-account-id-by-phone-query.tsx';
import {useState} from 'react';
import phoneValidator from 'phone';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ContrastColor} from '@atb/theme/colors';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query.ts';

export const SubmitButton = ({
  state: {settingPhone, settingName, recipient, phone, prefix, name, error},
  onSubmit,
  onError,
  themeColor,
}: {
  state: RecipientSelectionState;
  onSubmit: (r: TicketRecipientType) => void;
  onError: (c?: OnBehalfOfErrorCode) => void;
  themeColor: ContrastColor;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {mutateAsync: getAccountIdByPhone} = useGetAccountIdByPhoneMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: recipients} = useFetchOnBehalfOfAccountsQuery({enabled: true});

  const onPress = async () => {
    if (recipient) {
      onSubmit(recipient);
      return;
    }

    setIsSubmitting(true);
    onError(undefined);

    if (!settingPhone) {
      setIsSubmitting(false);
      onError('no_recipient_selected');
      return;
    }

    if (!phone) {
      setIsSubmitting(false);
      onError('invalid_phone');
      return;
    }

    const fullPhoneNumber = '+' + prefix + phone;
    const phoneValidation = phoneValidator(fullPhoneNumber, {
      strictDetection: true,
      validateMobilePrefix: false,
    });

    if (!phoneValidation.isValid) {
      setIsSubmitting(false);
      onError('invalid_phone');
      return;
    }

    const phoneAlreadyExists = recipients?.some(
      (r) => r.phoneNumber === fullPhoneNumber,
    );
    if (phoneAlreadyExists) {
      setIsSubmitting(false);
      onError('phone_already_exists');
      return;
    }

    const nameAlreadyExists =
      settingName && recipients?.some((r) => r.name === name);
    if (nameAlreadyExists) {
      setIsSubmitting(false);
      onError('name_already_exists');
      return;
    }

    if (settingName) {
      if (!name) {
        setIsSubmitting(false);
        onError('missing_recipient_name');
        return;
      } else if (name.length > 30) {
        setIsSubmitting(false);
        onError('too_long_recipient_name');
        return;
      }
    }

    try {
      const accountId = await getAccountIdByPhone(fullPhoneNumber);
      setIsSubmitting(false);

      if (accountId) {
        onSubmit({
          accountId,
          name: settingName ? name : undefined,
          phoneNumber: fullPhoneNumber,
        });
      } else {
        onError('no_associated_account');
      }
    } catch {
      setIsSubmitting(false);
      onError('unknown_error');
    }
  };

  return (
    <View style={styles.container}>
      {isSubmitting && (
        <ActivityIndicator size="large" color={themeColor.foreground.primary} />
      )}

      {error === 'unknown_error' && !isSubmitting && (
        <MessageInfoBox
          style={styles.errorMessage}
          type="error"
          message={t(PhoneInputTexts.errors[error])}
        />
      )}

      {error === 'no_recipient_selected' && !isSubmitting && (
        <MessageInfoBox
          style={styles.errorMessage}
          type="error"
          message={t(OnBehalfOfTexts.errors[error])}
        />
      )}

      {!isSubmitting && (
        <Button
          interactiveColor={theme.color.interactive[0]}
          onPress={onPress}
          text={t(PurchaseOverviewTexts.summary.button.payment)}
          testID="toPaymentButton"
          rightIcon={{svg: ArrowRight}}
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {marginTop: theme.spacing.xLarge},
  errorMessage: {marginBottom: theme.spacing.medium},
}));
