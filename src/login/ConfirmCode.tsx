import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import {
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
} from '@atb/auth/AuthContext';
import {MessageBox} from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import {loginConfirmCodeInputId} from '@atb/test-ids';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function ConfirmCode({
  phoneNumber,
  doAfterLogin,
}: {
  phoneNumber: string;
  doAfterLogin: () => void;
}) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {authenticationType, confirmCode, signInWithPhoneNumber} =
    useAuthState();
  const [code, setCode] = useState('');
  const [error, setError] = useState<
    ConfirmationErrorCode | PhoneSignInErrorCode
  >();
  const [isLoading, setIsLoading] = useState(false);
  const focusRef = useFocusOnLoad();

  const onLogin = async () => {
    setIsLoading(true);
    const errorCode = await confirmCode(code);
    if (!errorCode) {
      doAfterLogin();
    } else {
      setError(errorCode);
      setIsLoading(false);
    }
  };

  const onResendCode = async () => {
    setIsLoading(true);
    setError(undefined);
    setCode('');
    const errorCode = await signInWithPhoneNumber(phoneNumber, true);
    setIsLoading(false);
    if (errorCode) {
      setError(errorCode);
    }
  };

  // User might be automatically logged in with Firebase auth, but only on Android
  // Check authentication from state and see if it is updated while we wait
  useEffect(() => {
    if (authenticationType === 'phone') {
      doAfterLogin();
    }
  }, [authenticationType]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(LoginTexts.logInOptions.title)}
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
              {t(LoginTexts.confirmCode.title)}
            </ThemeText>
          </View>
          <View>
            <ThemeText style={styles.description} color={themeColor}>
              {t(LoginTexts.confirmCode.description(phoneNumber))}
            </ThemeText>
          </View>
          <Sections.Section>
            <Sections.TextInput
              label={t(LoginTexts.confirmCode.input.label)}
              placeholder={t(LoginTexts.confirmCode.input.placeholder)}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              showClear={true}
              inlineLabel={false}
              value={code}
              autoFocus={true}
              testID={loginConfirmCodeInputId}
            />
          </Sections.Section>
          <View style={styles.buttonView}>
            {isLoading && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
              />
            )}

            {error && !isLoading && (
              <MessageBox
                style={styles.messageBox}
                type="error"
                message={t(LoginTexts.confirmCode.errors[error])}
              />
            )}

            {!isLoading && (
              <>
                <Button
                  interactiveColor="interactive_0"
                  onPress={onLogin}
                  text={t(LoginTexts.confirmCode.mainButton)}
                  disabled={!code}
                  icon={ArrowRight}
                  iconPosition="right"
                  style={styles.submitButton}
                  testID="submitButton"
                />
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={onResendCode}
                  accessibilityRole="button"
                  testID="resendCodeButton"
                >
                  <ThemeText
                    style={styles.resendButtonText}
                    type="body__primary--underline"
                    color={themeColor}
                  >
                    {t(LoginTexts.confirmCode.resendButton)}
                  </ThemeText>
                </TouchableOpacity>
              </>
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
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  submitButton: {
    marginTop: theme.spacings.medium,
  },
  resendButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
