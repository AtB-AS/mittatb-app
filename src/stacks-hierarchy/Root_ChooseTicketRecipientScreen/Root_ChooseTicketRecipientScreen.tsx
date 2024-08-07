import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {
  PhoneInputSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useGetAccountIdByPhoneMutation} from '@atb/on-behalf-of/queries/use-get-account-id-by-phone-query';
import {GetAccountByPhoneErrorCode} from '@atb/on-behalf-of';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColorByType} from '@atb/theme/colors';
import {
  OnBehalfOfTexts,
  PhoneInputTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import phone from 'phone';
import {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useIsSaveTicketRecipientsEnabled} from '@atb/ticket-recipients';
import {Checkbox} from '@atb/components/checkbox';
import {animateNextChange} from '@atb/utils/animation.ts';

type ChooseRecipientErrorCode = 'missing_recipient_name';

type OnBehalfOfError = GetAccountByPhoneErrorCode | ChooseRecipientErrorCode;

type Props = RootStackScreenProps<'Root_ChooseTicketRecipientScreen'>;
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ChooseTicketRecipientScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();

  const {mutateAsync: getAccountIdByPhone} = useGetAccountIdByPhoneMutation();

  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<OnBehalfOfError>();
  const {themeName} = useTheme();
  const isSaveTicketRecipientsEnabled = useIsSaveTicketRecipientsEnabled();
  const [shouldSaveRecipientName, setShouldSaveRecipientName] = useState(false);
  const [recipientName, setRecipientName] = useState('');

  const phoneValidationParams = {
    strictDetection: true,
    validateMobilePrefix: false,
  };

  const phoneValidation = phone(
    '+' + prefix + phoneNumber,
    phoneValidationParams,
  );

  const isValidPhoneNumber = phoneValidation.isValid;

  const onNext = async () => {
    setIsSubmitting(true);
    setError(undefined);
    if (!phoneValidation.phoneNumber) {
      setIsSubmitting(false);
      setError('invalid_phone');
      return;
    }

    if (shouldSaveRecipientName && !recipientName) {
      setIsSubmitting(false);
      setError('missing_recipient_name');
      return;
    }

    try {
      const accountId = await getAccountIdByPhone(phoneValidation.phoneNumber);

      setIsSubmitting(false);

      if (accountId) {
        navigation.navigate('Root_PurchaseConfirmationScreen', {
          ...params,
          recipient: {
            accountId,
            phoneNumber: phoneValidation.phoneNumber,
            name: shouldSaveRecipientName ? recipientName : undefined,
          },
        });
      } else {
        setError('no_associated_account');
      }
    } catch {
      setIsSubmitting(false);
      setError('unknown_error');
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={t(OnBehalfOfTexts.chooseReceiver.header)}
        setFocusOnLoad={false}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View accessible={true} accessibilityRole="header" ref={focusRef}>
            <ThemeText
              type="heading--big"
              color={themeColor}
              style={styles.header}
            >
              {t(OnBehalfOfTexts.chooseReceiver.title)}
            </ThemeText>
          </View>
          <View accessible={true}>
            <ThemeText
              type="body__primary"
              color={themeColor}
              style={styles.subheader}
            >
              {t(OnBehalfOfTexts.chooseReceiver.subtitle)}
            </ThemeText>
          </View>
          <Section style={styles.inputs}>
            <PhoneInputSectionItem
              label={t(PhoneInputTexts.input.title)}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setError(undefined);
              }}
              prefix={prefix}
              onChangePrefix={setPrefix}
              showClear={true}
              keyboardType="number-pad"
              placeholder={t(PhoneInputTexts.input.placeholder.sendTicket)}
              autoFocus={true}
              textContentType="telephoneNumber"
              errorText={
                error === 'invalid_phone' || error === 'no_associated_account'
                  ? t(PhoneInputTexts.errors[error])
                  : undefined
              }
            />
            {shouldSaveRecipientName && (
              <TextInputSectionItem
                label={t(OnBehalfOfTexts.nameInputLabel)}
                placeholder={t(OnBehalfOfTexts.nameInputPlaceholder)}
                onChangeText={(text) => {
                  setRecipientName(text);
                  setError(undefined);
                }}
                value={recipientName}
                inlineLabel={false}
                autoFocus={true}
                errorText={
                  error === 'missing_recipient_name'
                    ? t(OnBehalfOfTexts.errors[error])
                    : undefined
                }
              />
            )}
          </Section>

          {isSaveTicketRecipientsEnabled && (
            <TouchableOpacity
              style={styles.saveRecipientCheckbox}
              onPress={() => {
                animateNextChange();
                setShouldSaveRecipientName((prev) => !prev);
              }}
              accessibilityRole="checkbox"
              accessibilityState={{checked: shouldSaveRecipientName}}
            >
              <Checkbox checked={shouldSaveRecipientName} />
              <ThemeText color={themeColor}>
                {t(OnBehalfOfTexts.saveCheckBoxLabel)}
              </ThemeText>
            </TouchableOpacity>
          )}

          <View style={styles.buttonView}>
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
                onPress={onNext}
                text={t(PurchaseOverviewTexts.summary.button.payment)}
                disabled={!isValidPhoneNumber}
                testID="toPaymentButton"
                rightIcon={{svg: ArrowRight}}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {flex: 1},
  contentContainerStyle: {padding: theme.spacings.medium},
  header: {marginTop: theme.spacings.medium, textAlign: 'center'},
  subheader: {textAlign: 'center', marginTop: theme.spacings.medium},
  inputs: {marginTop: theme.spacings.xLarge},
  saveRecipientCheckbox: {
    marginTop: theme.spacings.medium,
    flexDirection: 'row',
    gap: theme.spacings.medium,
  },
  errorMessage: {marginBottom: theme.spacings.medium},
  buttonView: {marginTop: theme.spacings.xLarge},
}));
