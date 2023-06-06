import React, {useState} from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {LoginTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useTheme} from '@atb/theme';
import {useAuthState} from '@atb/auth';
import {PhoneSignInErrorCode} from '@atb/auth/AuthContext';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import phone from 'phone';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StaticColorByType} from '@atb/theme/colors';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginPhoneInputScreen'>;

export const Root_LoginPhoneInputScreen = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {signInWithPhoneNumber} = useAuthState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [prefix, setPrefix] = useState('47');
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
      navigation.navigate('Root_LoginConfirmCodeScreen', {
        afterLogin,
        phoneNumber: phoneValidation.phoneNumber,
      });
    } else {
      setIsSubmitting(false);
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
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
                color={theme.text.colors.primary}
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
