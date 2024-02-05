import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useGetAccountIdByPhoneMutation} from '@atb/on-behalf-of/queries/use-get-account-id-by-phone-query';
import {GetAccountByPhoneErrorCode} from '@atb/on-behalf-of/types';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType, getStaticColor} from '@atb/theme/colors';
import {
  PhoneInputTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {OnBehalfOfTexts} from '@atb/translations/screens/subscreens/OnBehalfOf';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import phone from 'phone';
import {useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

type Props = RootStackScreenProps<'Root_ChooseTicketReceiverScreen'>;
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ChooseTicketReceiverScreen: React.FC<Props> = ({
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

  const [error, setError] = useState<GetAccountByPhoneErrorCode>();
  const {themeName} = useTheme();

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

    try {
      const result = await getAccountIdByPhone(phoneValidation.phoneNumber);

      setIsSubmitting(false);

      if (result) {
        navigation.navigate('Root_PurchaseConfirmationScreen', {
          ...params,
          phoneNumber: phoneValidation.phoneNumber,
          destinationAccountId: result,
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
          centerContent={true}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
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
          <Section>
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
                error !== 'unknown_error'
                  ? error && t(PhoneInputTexts.errors[error])
                  : undefined
              }
            />
          </Section>

          <View style={styles.buttonView}>
            {isSubmitting && (
              <ActivityIndicator
                style={styles.activityIndicator}
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
                style={styles.submitButton}
                interactiveColor="interactive_0"
                onPress={onNext}
                text={t(PurchaseOverviewTexts.summary.button.payment)}
                disabled={!isValidPhoneNumber}
                testID="toPaymentButton"
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
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: theme.spacings.xLarge,
  },
  contentContainerStyle: {
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
  },
  header: {
    alignContent: 'space-around',
    textAlign: 'center',
  },
  subheader: {
    textAlign: 'center',
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
  },
  activityIndicator: {
    marginVertical: theme.spacings.large,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  submitButton: {
    marginTop: theme.spacings.medium,
  },
}));
