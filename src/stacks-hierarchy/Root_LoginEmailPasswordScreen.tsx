import React, {useEffect, useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  authEmailLogIn,
  authEmailReset,
  EmailSignInErrorCode,
  setPendingEmailPassword,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Section} from '@atb/components/sections';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRateLimitWhen} from '@atb/utils/use-rate-limit-when';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {SessionReplayMask} from '@atb/modules/analytics';
import {
  EmailLoginLayout,
  EmailLoginLinkButton,
} from './login-email/EmailLoginLayout';
import {EmailPasswordInput} from './login-email/EmailPasswordInput';

type Props = RootStackScreenProps<'Root_LoginEmailPasswordScreen'>;

export const Root_LoginEmailPasswordScreen = ({navigation, route}: Props) => {
  const {email, notice} = route.params;
  const {t, language} = useTranslation();
  const focusRef = useFocusOnLoad(navigation, false);
  const {completeOnboardingSection} = useOnboardingContext();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<EmailSignInErrorCode>();
  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    if (notice) setShowNotice(true);
  }, [notice]);
  // Only log-in is blocked during the lockout. Reset stays available (D17).
  const {isRateLimited, rateLimitIfNeeded} =
    useRateLimitWhen<EmailSignInErrorCode>((code) => code === 'login_locked');

  const onLogin = async () => {
    if (isRateLimited) return;
    setIsLoading(true);
    const errorCode = await authEmailLogIn(email, password, language);

    if (errorCode === 'email_not_verified') {
      // identity has sent a code. Keep the password in memory for the code
      // screen, which repeats the log-in with the code.
      setIsLoading(false);
      setError(undefined);
      setPendingEmailPassword(password);
      navigation.navigate('Root_LoginEmailConfirmCodeScreen', {
        email,
        purpose: 'verify',
        codeSentAt: Date.now(),
      });
      return;
    }

    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
      setIsLoading(false);
      return;
    }
    completeOnboardingSection('userCreation');
  };

  const onForgotPassword = async () => {
    setIsLoading(true);
    const errorCode = await authEmailReset(email, language);
    setIsLoading(false);
    if (errorCode) {
      setError(errorCode);
      return;
    }
    setError(undefined);
    navigation.navigate('Root_LoginEmailConfirmCodeScreen', {
      email,
      purpose: 'reset',
      codeSentAt: Date.now(),
    });
  };

  const errorMessage = error
    ? t(LoginTexts.email.errors[error])
    : showNotice
      ? t(LoginTexts.email.errors.password_lost)
      : undefined;

  return (
    <EmailLoginLayout
      flow="logIn"
      title={t(LoginTexts.email.password.title)}
      description={t(LoginTexts.email.password.description(email))}
      focusRef={focusRef}
      isLoading={isLoading}
      errorMessage={errorMessage}
      mainButton={{
        text: t(LoginTexts.email.password.mainButton),
        onPress: onLogin,
        disabled: !password || isRateLimited,
        testID: 'emailLoginButton',
      }}
      footer={
        <>
          <EmailLoginLinkButton
            text={t(LoginTexts.email.password.forgotPassword)}
            onPress={onForgotPassword}
            testID="forgotPasswordButton"
          />
          <EmailLoginLinkButton
            text={t(LoginTexts.email.password.changeEmail)}
            onPress={() =>
              navigation.navigate('Root_LoginEmailInputScreen', {})
            }
            testID="changeEmailButton"
          />
        </>
      }
    >
      <SessionReplayMask>
        <Section>
          <EmailPasswordInput
            kind="current"
            label={t(LoginTexts.email.password.label)}
            placeholder={t(LoginTexts.email.password.placeholder)}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(undefined);
              setShowNotice(false);
            }}
            autoFocus={true}
            testID="loginPasswordInput"
          />
        </Section>
      </SessionReplayMask>
    </EmailLoginLayout>
  );
};
