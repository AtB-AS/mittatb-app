import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import ThemeText from '@atb/components/text';
import {PhoneSignInErrorCode} from '@atb/auth/AuthContext';
import {MessageBox} from '@atb/components/message-box';
import {useNavigation} from '@react-navigation/native';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import phone from 'phone';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function PhoneInput({
  doAfterLogin,
  headerLeftButton,
  headerRightButton,
}: {
  doAfterLogin: (phoneNumber: string) => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [prefix, setPrefix] = useState('47');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();
  const navigation = useNavigation();
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

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsSubmitting(false);
      }),
    [navigation],
  );

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
    const errorCode = await signInWithPhoneNumber(phoneValidation.phoneNumber);
    if (!errorCode) {
      setError(undefined);
      doAfterLogin(phoneValidation.phoneNumber);
    } else {
      setIsSubmitting(false);
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={headerLeftButton}
        rightButton={headerRightButton}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(LoginTexts.phoneInput.title)}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          centerContent={true}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View accessible={true} accessibilityRole="header" ref={focusRef}>
            <ThemeText
              type={'body__primary--jumbo--bold'}
              style={styles.title}
              color={themeColor}
            >
              {t(LoginTexts.phoneInput.title)}
            </ThemeText>
          </View>
          <View accessible={true}>
            <ThemeText style={styles.description} color={themeColor}>
              {t(LoginTexts.phoneInput.description)}
            </ThemeText>
          </View>
          <Sections.Section>
            <Sections.PhoneInput
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
          </Sections.Section>
          <View style={styles.buttonView}>
            {isSubmitting && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
              />
            )}

            {error && !isSubmitting && (
              <MessageBox
                style={styles.errorMessage}
                type="error"
                message={t(LoginTexts.phoneInput.errors.invalid_phone)}
              />
            )}

            {!isSubmitting && (
              <Button
                style={styles.submitButton}
                interactiveColor="interactive_0"
                onPress={onNext}
                text={t(LoginTexts.phoneInput.mainButton)}
                disabled={!isValidPhoneNumber(phoneNumber)}
                rightIcon={{svg: ArrowRight}}
                testID="sendCodeButton"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
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
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
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
