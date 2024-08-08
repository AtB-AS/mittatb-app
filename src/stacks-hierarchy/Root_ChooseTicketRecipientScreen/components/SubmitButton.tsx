import {
  ExistingRecipientType,
  OnBehalfOfErrorCode,
  RecipientSelectionState,
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {TicketRecipientType} from '@atb/stacks-hierarchy/types.ts';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  PhoneInputTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {useGetAccountIdByPhoneMutation} from '@atb/on-behalf-of/queries/use-get-account-id-by-phone-query.tsx';
import {useState} from 'react';
import phoneValidator from 'phone';
import {ActivityIndicator, View} from 'react-native';
import {getStaticColor, StaticColor} from '@atb/theme/colors.ts';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {FETCH_RECIPIENTS_QUERY_KEY} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {useQueryClient} from '@tanstack/react-query';
import {useAuthState} from '@atb/auth';

export const SubmitButton = ({
  state: {settingName, recipient, phone, prefix, name, error},
  onSubmit,
  onError,
  themeColor,
}: {
  state: RecipientSelectionState;
  onSubmit: (r: TicketRecipientType) => void;
  onError: (c?: OnBehalfOfErrorCode) => void;
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {userId} = useAuthState();
  const {mutateAsync: getAccountIdByPhone} = useGetAccountIdByPhoneMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onPress = async () => {
    if (recipient) {
      onSubmit(recipient);
    }

    setIsSubmitting(true);
    onError(undefined);

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

    const recipients = queryClient.getQueryData<ExistingRecipientType[]>([
      FETCH_RECIPIENTS_QUERY_KEY,
      userId,
    ]);

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

    if (settingName && !name) {
      setIsSubmitting(false);
      onError('missing_recipient_name');
      return;
    }

    try {
      const accountId = await getAccountIdByPhone(fullPhoneNumber);
      setIsSubmitting(false);

      if (accountId) {
        onSubmit({accountId, name, phoneNumber: fullPhoneNumber});
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
        <ActivityIndicator
          size="large"
          color={getStaticColor(themeName, themeColor).text}
        />
      )}

      {error === 'unknown_error' && !isSubmitting && (
        <MessageInfoBox
          style={styles.errorMessage}
          type="error"
          message={t(PhoneInputTexts.errors[error])}
        />
      )}

      {!isSubmitting && (
        <Button
          interactiveColor="interactive_0"
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
  container: {marginTop: theme.spacings.xLarge},
  errorMessage: {marginBottom: theme.spacings.medium},
}));
