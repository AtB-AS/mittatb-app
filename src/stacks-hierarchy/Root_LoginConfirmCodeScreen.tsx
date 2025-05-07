import React, {useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
  useAuthContext,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useOnboardingContext} from '@atb/onboarding';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {useRateLimitWhen} from '@atb/utils/use-rate-limit-when';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_LoginConfirmCodeScreen'>;
type LoginErrorCode = ConfirmationErrorCode | PhoneSignInErrorCode;

export const Root_LoginConfirmCodeScreen = ({route}: Props) => {
  const {phoneNumber} = route.params;
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {confirmCode, signInWithPhoneNumber} = useAuthContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState<LoginErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const focusRef = useFocusOnLoad();
  const {completeOnboardingSection} = useOnboardingContext();
  const {isRateLimited, rateLimitIfNeeded} = useRateLimitWhen<LoginErrorCode>(
    (code) => code === 'too_many_attempts',
  );

  const onLogin = async () => {
    if (isRateLimited) return;
    setIsLoading(true);
    completeOnboardingSection('userCreation');
    const errorCode = await confirmCode(code);
    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
      setIsLoading(false);
    }
  };

  const onResendCode = async () => {
    if (isRateLimited) return;
    setIsLoading(true);
    setError(undefined);
    setCode('');
    const errorCode = await signInWithPhoneNumber(phoneNumber, true);
    setIsLoading(false);
    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(LoginTexts.logInOptions.title)}
        globalMessageContext={GlobalMessageContextEnum.appLoginPhone}
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
              typography="body__primary--jumbo--bold"
              style={styles.title}
              color={themeColor}
            >
              {t(LoginTexts.confirmCode.title)}
            </ThemeText>
          </View>
          <View>
            <ThemeText style={styles.description} color={themeColor}>
              {t(LoginTexts.confirmCode.description(phoneNumber))}
            </ThemeText>
          </View>
          <Section>
            <TextInputSectionItem
              label={t(LoginTexts.confirmCode.input.label)}
              placeholder={t(LoginTexts.confirmCode.input.placeholder)}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              showClear={true}
              inlineLabel={false}
              value={code}
              autoFocus={true}
              testID="loginConfirmCodeInput"
            />
          </Section>
          <View style={styles.buttonView}>
            {isLoading && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color={themeColor.foreground.primary}
              />
            )}

            {error && !isLoading && (
              <MessageInfoBox
                style={styles.messageBox}
                type="error"
                message={t(LoginTexts.confirmCode.errors[error])}
              />
            )}

            {!isLoading && (
              <>
                <Button
                  expanded={true}
                  interactiveColor={theme.color.interactive[0]}
                  onPress={onLogin}
                  text={t(LoginTexts.confirmCode.mainButton)}
                  disabled={!code || isRateLimited}
                  rightIcon={{svg: ArrowRight}}
                  style={styles.submitButton}
                  testID="submitButton"
                />
                <PressableOpacity
                  style={styles.resendButton}
                  onPress={onResendCode}
                  accessibilityRole="button"
                  testID="resendCodeButton"
                >
                  <ThemeText
                    style={styles.resendButtonText}
                    typography="body__primary--underline"
                    color={themeColor}
                  >
                    {t(LoginTexts.confirmCode.resendButton)}
                  </ThemeText>
                </PressableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: theme.spacing.xLarge,
  },
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  description: {
    marginVertical: theme.spacing.large,
    textAlign: 'center',
  },
  activityIndicator: {
    marginVertical: theme.spacing.large,
  },
  messageBox: {
    marginBottom: theme.spacing.medium,
  },
  buttonView: {
    marginTop: theme.spacing.medium,
  },
  submitButton: {
    marginTop: theme.spacing.medium,
  },
  resendButton: {
    marginTop: theme.spacing.medium,
    padding: theme.spacing.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
