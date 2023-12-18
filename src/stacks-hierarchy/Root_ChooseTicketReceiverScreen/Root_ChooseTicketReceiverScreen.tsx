import {PhoneSignInErrorCode} from '@atb/auth';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType, getStaticColor} from '@atb/theme/colors';
import {
  LoginTexts,
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
  const {themeName} = useTheme();

  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();
  const focusRef = useFocusOnLoad();

  const phoneValidationParams = {
    strictDetection: true,
    validateMobilePrefix: false,
  };

  const isValidPhoneNumber = (number: string) => {
    const validationResult = phone(
      '+' + prefix + number,
      phoneValidationParams,
    );
    return validationResult.isValid;
  };

  const {
    fromPlace,
    toPlace,
    preassignedFareProduct,
    userProfilesWithCount,
    travelDate,
  } = params;

  const onNext = async () => {
    setIsSubmitting(true);
    const phoneValidation = phone(
      '+' + prefix + phoneNumber,
      phoneValidationParams,
    );
    if (!phoneValidation.phoneNumber) {
      setIsSubmitting(false);
      setError('invalid_phone');
      return;
    }
    
    // TODO: replace promise with proper API call
    const errorCode = await new Promise(r => setTimeout(r, 1000)); 
    if (!errorCode) {
      setError(undefined);
      setIsSubmitting(false);
      navigation.navigate('Root_PurchaseConfirmationScreen', {
        fareProductTypeConfig: params.fareProductTypeConfig,
        fromPlace: fromPlace,
        toPlace: toPlace,
        userProfilesWithCount: userProfilesWithCount,
        preassignedFareProduct,
        travelDate,
        headerLeftButton: {type: 'back'},
        mode: params.mode,
        phoneNumber: `+${prefix}${phoneNumber}`,
      });
    } else {
      setIsSubmitting(false);
      // setError(errorCode);
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
              label={t(LoginTexts.phoneInput.input.heading)}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              prefix={prefix}
              onChangePrefix={setPrefix}
              showClear={true}
              keyboardType="number-pad"
              placeholder={t(LoginTexts.phoneInput.input.placeholder)}
              autoFocus={true}
              textContentType="telephoneNumber"
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

            {error && !isSubmitting && (
              <MessageBox
                style={styles.errorMessage}
                type="error"
                message={t(LoginTexts.phoneInput.errors[error])}
              />
            )}

            {!isSubmitting && (
              <Button
                style={styles.submitButton}
                interactiveColor="interactive_0"
                onPress={onNext}
                text={t(PurchaseOverviewTexts.summary.button)}
                disabled={!isValidPhoneNumber(phoneNumber)}
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
