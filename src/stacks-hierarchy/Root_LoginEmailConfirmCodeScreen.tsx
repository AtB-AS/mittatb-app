import React, {useEffect, useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  authEmailCreate,
  authEmailLogIn,
  authEmailReset,
  authEmailResetConfirm,
  authEmailStart,
  clearPendingEmailPassword,
  EmailSignInErrorCode,
  getPendingEmailPassword,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRateLimitWhen} from '@atb/utils/use-rate-limit-when';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {SessionReplayMask} from '@atb/modules/analytics';
import {Language} from '@atb/translations';
import {EmailCodePurpose} from '@atb/stacks-hierarchy/navigation-types';
import {
  EmailLoginLayout,
  EmailLoginLinkButton,
} from './login-email/EmailLoginLayout';

type Props = RootStackScreenProps<'Root_LoginEmailConfirmCodeScreen'>;

// Matches identity's resend cooldown
const RESEND_COOLDOWN_MS = 60 * 1000;

const submitCode = (
  purpose: EmailCodePurpose,
  email: string,
  password: string,
  code: string,
  language: Language,
) => {
  switch (purpose) {
    case 'signup':
      return authEmailCreate(email, password, code);
    case 'verify':
      return authEmailLogIn(email, password, language, code);
    case 'reset':
      return authEmailResetConfirm(email, code, password);
  }
};

const resendCode = async (
  purpose: EmailCodePurpose,
  email: string,
  password: string,
  language: Language,
): Promise<EmailSignInErrorCode | undefined> => {
  switch (purpose) {
    case 'signup': {
      const result = await authEmailStart(email, language);
      return result.error;
    }
    case 'verify': {
      // Logging in again without a code makes identity send a new one
      const errorCode = await authEmailLogIn(email, password, language);
      return errorCode === 'email_not_verified' ? undefined : errorCode;
    }
    case 'reset':
      return authEmailReset(email, language);
  }
};

export const Root_LoginEmailConfirmCodeScreen = ({
  navigation,
  route,
}: Props) => {
  const {email, purpose} = route.params;
  const {t, language} = useTranslation();
  const focusRef = useFocusOnLoad(navigation);
  const {completeOnboardingSection} = useOnboardingContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState<EmailSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const {isRateLimited, rateLimitIfNeeded} =
    useRateLimitWhen<EmailSignInErrorCode>(
      (code) => code === 'too_many_attempts',
    );

  // A code was just sent, so wait before allowing a new one
  useEffect(() => {
    setCanResend(false);
    const timeout = setTimeout(() => setCanResend(true), RESEND_COOLDOWN_MS);
    return () => clearTimeout(timeout);
  }, [resendCount]);

  const onSubmit = async () => {
    if (isRateLimited) return;
    const password = getPendingEmailPassword();
    if (!password) {
      setError('unknown_error');
      return;
    }
    setIsLoading(true);
    const errorCode = await submitCode(
      purpose,
      email,
      password,
      code,
      language,
    );
    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
      setIsLoading(false);
      return;
    }
    clearPendingEmailPassword();
    completeOnboardingSection('userCreation');
  };

  const onResend = async () => {
    if (isRateLimited || !canResend) return;
    setIsLoading(true);
    setError(undefined);
    setCode('');
    const errorCode = await resendCode(
      purpose,
      email,
      getPendingEmailPassword() ?? '',
      language,
    );
    setIsLoading(false);
    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
    }
    setResendCount((count) => count + 1);
  };

  return (
    <EmailLoginLayout
      title={t(LoginTexts.confirmCode.title)}
      description={t(
        purpose === 'verify'
          ? LoginTexts.email.confirmCode.verifyDescription(email)
          : LoginTexts.email.confirmCode.description(email),
      )}
      focusRef={focusRef}
      isLoading={isLoading}
      errorMessage={error ? t(LoginTexts.email.errors[error]) : undefined}
      mainButton={{
        text: t(LoginTexts.confirmCode.mainButton),
        onPress: onSubmit,
        disabled: !code || isRateLimited,
        testID: 'submitButton',
      }}
      footer={
        <EmailLoginLinkButton
          text={t(LoginTexts.confirmCode.resendButton)}
          onPress={onResend}
          disabled={!canResend || isRateLimited}
          testID="resendCodeButton"
        />
      }
    >
      <SessionReplayMask>
        <Section>
          <TextInputSectionItem
            label={t(LoginTexts.confirmCode.input.label)}
            placeholder={t(LoginTexts.confirmCode.input.placeholder)}
            onChangeText={(text) => {
              setCode(text);
              setError(undefined);
            }}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            maxLength={6}
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
