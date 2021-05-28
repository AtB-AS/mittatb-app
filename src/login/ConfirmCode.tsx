import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import {
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
} from '@atb/auth/AuthContext';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {onboardingThemeColor} from '@atb/screens/Onboarding';

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
  const {
    authenticationType,
    confirmCode,
    signInWithPhoneNumber,
  } = useAuthState();
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
    const errorCode = await signInWithPhoneNumber(phoneNumber);
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
        color={onboardingThemeColor}
      />

      <View style={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            color={onboardingThemeColor}
          >
            {t(LoginTexts.confirmCode.title)}
          </ThemeText>
        </View>
        <View>
          <ThemeText style={styles.description} color={onboardingThemeColor}>
            {t(LoginTexts.confirmCode.description(phoneNumber))}
          </ThemeText>
        </View>
        <Sections.Section>
          <Sections.TextInput
            label={t(LoginTexts.confirmCode.input.label)}
            placeholder={t(LoginTexts.confirmCode.input.placeholder)}
            onChangeText={setCode}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
            value={code}
          />
        </Sections.Section>
        <View style={styles.buttonView}>
          {isLoading && (
            <ActivityIndicator color={theme.text.colors.primary} size="large" />
          )}

          {error && !isLoading && (
            <MessageBox
              containerStyle={styles.messageBox}
              type="error"
              message={t(LoginTexts.confirmCode.errors[error])}
            />
          )}

          {!isLoading && (
            <>
              <Button
                color={'secondary_1'}
                onPress={onLogin}
                text={t(LoginTexts.confirmCode.mainButton)}
                disabled={!code}
                icon={ArrowRight}
                iconPosition="right"
              />
              <TouchableOpacity
                style={styles.resendButton}
                onPress={onResendCode}
                accessibilityRole="button"
              >
                <ThemeText
                  style={styles.resendButtonText}
                  type="body__primary--underline"
                  color={onboardingThemeColor}
                >
                  {t(LoginTexts.confirmCode.resendButton)}
                </ThemeText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[onboardingThemeColor].backgroundColor,
    flex: 1,
  },
  mainView: {
    margin: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  resendButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
