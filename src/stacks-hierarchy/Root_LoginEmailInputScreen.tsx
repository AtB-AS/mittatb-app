import React, {useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  authEmailReset,
  authEmailStart,
  clearEmailLoginSession,
  EmailSignInErrorCode,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRateLimitWhen} from '@atb/utils/use-rate-limit-when';
import {isValidEmail} from '@atb/utils/validation';
import {StyleSheet} from '@atb/theme';
import {
  EmailLoginLayout,
  EmailLoginLinkButton,
} from './login-email/EmailLoginLayout';

type Props = RootStackScreenProps<'Root_LoginEmailInputScreen'>;

// Only name providers the user can recognise. Others get a generic message.
const providerNames: Record<string, string> = {
  'google.com': 'Google',
  'apple.com': 'Apple',
};

export const Root_LoginEmailInputScreen = ({navigation, route}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad(navigation, false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<EmailSignInErrorCode | undefined>(
    route.params?.notice,
  );
  const [federatedProviders, setFederatedProviders] = useState<string[]>();
  const {isRateLimited, rateLimitIfNeeded} =
    useRateLimitWhen<EmailSignInErrorCode>(
      (code) => code === 'too_many_codes_sent',
    );

  const trimmedEmail = email.trim();

  const onNext = async () => {
    if (isRateLimited) return;
    clearEmailLoginSession();
    setIsLoading(true);
    setFederatedProviders(undefined);
    const result = await authEmailStart(trimmedEmail, language);
    setIsLoading(false);

    if (result.error) {
      rateLimitIfNeeded(result.error);
      setError(result.error);
      return;
    }
    setError(undefined);

    switch (result.data.next) {
      case 'verify-code':
        // identity has sent a sign-up code
        navigation.navigate('Root_LoginEmailConfirmCodeScreen', {
          email: trimmedEmail,
          purpose: 'signup',
          codeSentAt: Date.now(),
        });
        break;
      case 'password':
        navigation.navigate('Root_LoginEmailPasswordScreen', {
          email: trimmedEmail,
        });
        break;
      case 'federated':
        setFederatedProviders(result.data.providers);
        break;
    }
  };

  // An account without a password, e.g. created with Google. Setting a
  // password goes through the reset flow, which also proves e-mail ownership.
  const onCreatePassword = async () => {
    if (isRateLimited) return;
    setIsLoading(true);
    const errorCode = await authEmailReset(trimmedEmail, language);
    setIsLoading(false);
    if (errorCode) {
      rateLimitIfNeeded(errorCode);
      setError(errorCode);
      return;
    }
    navigation.navigate('Root_LoginEmailConfirmCodeScreen', {
      email: trimmedEmail,
      purpose: 'reset',
      codeSentAt: Date.now(),
    });
  };

  const isFederated = federatedProviders !== undefined;
  const knownProvider = federatedProviders
    ?.map((id) => providerNames[id])
    .find((name) => name !== undefined);

  return (
    <EmailLoginLayout
      flow="logIn"
      title={t(LoginTexts.email.input.title)}
      description={t(LoginTexts.email.input.description)}
      focusRef={focusRef}
      isLoading={isLoading}
      errorMessage={error ? t(LoginTexts.email.errors[error]) : undefined}
      mainButton={{
        text: t(LoginTexts.email.input.mainButton),
        onPress: onNext,
        disabled: !isValidEmail(trimmedEmail) || isRateLimited,
        testID: 'emailContinueButton',
      }}
      footer={
        isFederated ? (
          <EmailLoginLinkButton
            text={t(LoginTexts.email.input.createPasswordButton)}
            onPress={onCreatePassword}
            disabled={isRateLimited}
            testID="emailCreatePasswordButton"
          />
        ) : undefined
      }
    >
      <Section>
        <TextInputSectionItem
          label={t(LoginTexts.email.input.label)}
          placeholder={t(LoginTexts.email.input.placeholder)}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(undefined);
            setFederatedProviders(undefined);
          }}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          showClear={true}
          inlineLabel={false}
          autoFocus={true}
          testID="loginEmailInput"
        />
      </Section>
      {isFederated && (
        <MessageInfoBox
          style={styles.federatedMessage}
          type="info"
          message={
            knownProvider
              ? t(LoginTexts.email.input.federated(knownProvider))
              : t(LoginTexts.email.input.federatedUnknown)
          }
        />
      )}
    </EmailLoginLayout>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  federatedMessage: {
    marginTop: theme.spacing.medium,
  },
}));
