import React, {useEffect, useRef, useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  authEmailLogIn,
  authEmailReset,
  authEmailStart,
  authEmailVerifyCode,
  clearEmailLoginSession,
  EMAIL_CODE_LENGTH,
  EmailSignInErrorCode,
  formatCountdown,
  getPendingEmailPassword,
  sanitizeEmailCode,
  setPendingEmailCode,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRateLimitWhen} from '@atb/utils/use-rate-limit-when';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {SessionReplayMask} from '@atb/modules/analytics';
import {Language} from '@atb/translations';
import {EmailCodePurpose} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet} from '@atb/theme';
import {
  EmailLoginFlow,
  EmailLoginLayout,
  EmailLoginLinkButton,
} from './login-email/EmailLoginLayout';

type Props = RootStackScreenProps<'Root_LoginEmailConfirmCodeScreen'>;

// Matches identity's resend cooldown
const RESEND_COOLDOWN_SECONDS = 60;

const flowForPurpose: Record<EmailCodePurpose, EmailLoginFlow> = {
  signup: 'createAccount',
  verify: 'logIn',
  reset: 'resetPassword',
};

const resendCode = async (
  purpose: EmailCodePurpose,
  email: string,
  password: string | undefined,
  language: Language,
): Promise<EmailSignInErrorCode | undefined> => {
  switch (purpose) {
    case 'signup':
      return (await authEmailStart(email, language)).error;
    case 'verify': {
      if (!password) return 'session_lost';
      // Logging in again without a code makes identity send a new one
      const errorCode = await authEmailLogIn(email, password, language);
      return errorCode === 'email_not_verified' ? undefined : errorCode;
    }
    case 'reset':
      return authEmailReset(email, language);
  }
};

/** Seconds left until a new code can be requested, ticking every second. */
const useResendCountdown = (codeSentAt: number) => {
  const [now, setNow] = useState(Date.now());
  const availableAt = codeSentAt + RESEND_COOLDOWN_SECONDS * 1000;
  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [codeSentAt]);
  return Math.max(0, (availableAt - now) / 1000);
};

/**
 * Enter the code sent by e-mail.
 *
 * - Sign-up and reset: the code is checked without being used up, then the
 *   user chooses a password on the next screen (D15).
 * - Verify (log-in on an unverified e-mail): logs in with the password from
 *   the previous screen and the code.
 */
export const Root_LoginEmailConfirmCodeScreen = ({
  navigation,
  route,
}: Props) => {
  const {email, purpose} = route.params;
  const {t, language} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad(navigation);
  const {completeOnboardingSection} = useOnboardingContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState<EmailSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const [codeSentAt, setCodeSentAt] = useState(route.params.codeSentAt);
  // Avoids submitting the same wrong code again when auto-submitting
  const lastSubmittedCode = useRef<string | undefined>(undefined);
  const secondsUntilResend = useResendCountdown(codeSentAt);
  const {isRateLimited, rateLimitIfNeeded} =
    useRateLimitWhen<EmailSignInErrorCode>(
      (code) => code === 'too_many_codes_sent',
    );

  // A new code was sent from another screen
  useEffect(() => {
    setCodeSentAt(route.params.codeSentAt);
    setCode('');
    setError(undefined);
    lastSubmittedCode.current = undefined;
  }, [route.params.codeSentAt]);

  const onSubmit = async (codeToSubmit: string) => {
    if (isLoading || codeToSubmit.length !== EMAIL_CODE_LENGTH) return;
    lastSubmittedCode.current = codeToSubmit;

    if (purpose === 'verify') {
      const password = getPendingEmailPassword();
      if (!password) {
        // The app was likely killed while the user was in their e-mail
        navigation.navigate('Root_LoginEmailPasswordScreen', {
          email,
          notice: 'password_lost',
        });
        return;
      }
      setIsLoading(true);
      const errorCode = await authEmailLogIn(
        email,
        password,
        language,
        codeToSubmit,
      );
      if (errorCode) {
        setError(errorCode);
        setIsLoading(false);
        return;
      }
      clearEmailLoginSession();
      completeOnboardingSection('userCreation');
      return;
    }

    setIsLoading(true);
    const errorCode = await authEmailVerifyCode(purpose, email, codeToSubmit);
    setIsLoading(false);
    if (errorCode) {
      setError(errorCode);
      return;
    }
    setError(undefined);
    setPendingEmailCode(codeToSubmit);
    navigation.navigate('Root_LoginEmailCreatePasswordScreen', {
      email,
      purpose,
    });
  };

  // Submit automatically when all digits are entered or pasted
  useEffect(() => {
    if (
      code.length === EMAIL_CODE_LENGTH &&
      code !== lastSubmittedCode.current
    ) {
      onSubmit(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const onResend = async () => {
    if (isRateLimited || secondsUntilResend > 0) return;
    setIsLoading(true);
    setError(undefined);
    setCode('');
    lastSubmittedCode.current = undefined;
    const errorCode = await resendCode(
      purpose,
      email,
      getPendingEmailPassword(),
      language,
    );
    setIsLoading(false);
    if (errorCode === 'session_lost') {
      navigation.navigate('Root_LoginEmailPasswordScreen', {
        email,
        notice: 'password_lost',
      });
      return;
    }
    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
    }
    setCodeSentAt(Date.now());
  };

  const canResend = secondsUntilResend <= 0 && !isRateLimited;

  return (
    <EmailLoginLayout
      flow={flowForPurpose[purpose]}
      title={t(LoginTexts.confirmCode.title)}
      description={t(
        purpose === 'verify'
          ? LoginTexts.email.confirmCode.verifyDescription(email)
          : LoginTexts.email.confirmCode.description(email),
      )}
      hint={t(LoginTexts.email.confirmCode.hint)}
      focusRef={focusRef}
      isLoading={isLoading}
      errorMessage={error ? t(LoginTexts.email.errors[error]) : undefined}
      mainButton={{
        text: t(LoginTexts.confirmCode.mainButton),
        onPress: () => onSubmit(code),
        disabled: code.length !== EMAIL_CODE_LENGTH,
        testID: 'submitButton',
      }}
      footer={
        <>
          <EmailLoginLinkButton
            text={
              canResend || isRateLimited
                ? t(LoginTexts.email.confirmCode.resend)
                : t(
                    LoginTexts.email.confirmCode.resendIn(
                      formatCountdown(secondsUntilResend),
                    ),
                  )
            }
            onPress={onResend}
            disabled={!canResend}
            testID="resendCodeButton"
          />
          {purpose === 'signup' && (
            <EmailLoginLinkButton
              text={t(LoginTexts.email.confirmCode.changeEmail)}
              onPress={() =>
                navigation.navigate('Root_LoginEmailInputScreen', {})
              }
              testID="changeEmailButton"
            />
          )}
        </>
      }
    >
      {purpose === 'signup' && (
        <MessageInfoBox
          style={styles.notice}
          type="info"
          message={t(LoginTexts.email.confirmCode.signUpNotice(email))}
        />
      )}
      <SessionReplayMask>
        <Section>
          <TextInputSectionItem
            label={t(LoginTexts.confirmCode.input.label)}
            placeholder={t(LoginTexts.confirmCode.input.placeholder)}
            onChangeText={(text) => {
              setCode(sanitizeEmailCode(text));
              setError(undefined);
            }}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            showClear={true}
            inlineLabel={false}
            value={code}
            autoFocus={true}
            testID="loginConfirmCodeInput"
          />
        </Section>
      </SessionReplayMask>
    </EmailLoginLayout>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  notice: {
    marginBottom: theme.spacing.medium,
  },
}));
