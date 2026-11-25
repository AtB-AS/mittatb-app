import React, {useState} from 'react';
import {View} from 'react-native';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  authEmailCreate,
  authEmailReset,
  authEmailResetConfirm,
  authEmailStart,
  clearEmailLoginSession,
  EmailSignInErrorCode,
  getPendingEmailCode,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {SessionReplayMask} from '@atb/modules/analytics';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  EmailLoginLayout,
  EmailLoginLinkButton,
} from './login-email/EmailLoginLayout';
import {EmailPasswordInput} from './login-email/EmailPasswordInput';

type Props = RootStackScreenProps<'Root_LoginEmailCreatePasswordScreen'>;

/** Errors meaning the verified code can no longer be used. */
const codeUnusableErrors: EmailSignInErrorCode[] = [
  'invalid_code',
  'session_expired',
  'too_many_attempts',
];

/**
 * Choose a password for sign-up or reset. The code has already been checked on
 * the previous screen; it is sent again here and used up (D15).
 */
export const Root_LoginEmailCreatePasswordScreen = ({
  navigation,
  route,
}: Props) => {
  const {email, purpose} = route.params;
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const textColor = theme.color.background.neutral[1];
  const focusRef = useFocusOnLoad(navigation, false);
  const {completeOnboardingSection} = useOnboardingContext();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<EmailSignInErrorCode>();

  const isLongEnough = isValidPassword(password);

  const onSubmit = async () => {
    const code = getPendingEmailCode();
    if (!code) {
      // The app was likely killed while the user was away; start over.
      navigation.navigate('Root_LoginEmailInputScreen', {
        notice: 'session_lost',
      });
      return;
    }
    if (!isLongEnough) {
      setError('weak_password');
      return;
    }
    setIsLoading(true);
    const errorCode =
      purpose === 'signup'
        ? await authEmailCreate(email, password, code)
        : await authEmailResetConfirm(email, code, password);
    if (errorCode) {
      setError(errorCode);
      setIsLoading(false);
      return;
    }
    clearEmailLoginSession();
    completeOnboardingSection('userCreation');
  };

  // The code expired or was used up while choosing a password. Send a new one
  // and go back to the code screen.
  const onNewCode = async () => {
    setIsLoading(true);
    const errorCode =
      purpose === 'signup'
        ? (await authEmailStart(email, language)).error
        : await authEmailReset(email, language);
    setIsLoading(false);
    if (errorCode) {
      setError(errorCode);
      return;
    }
    setError(undefined);
    navigation.navigate('Root_LoginEmailConfirmCodeScreen', {
      email,
      purpose,
      codeSentAt: Date.now(),
    });
  };

  const isSignUp = purpose === 'signup';

  return (
    <EmailLoginLayout
      flow={isSignUp ? 'createAccount' : 'resetPassword'}
      title={t(
        isSignUp
          ? LoginTexts.email.createPassword.signUpTitle
          : LoginTexts.email.createPassword.resetTitle,
      )}
      focusRef={focusRef}
      isLoading={isLoading}
      errorMessage={error ? t(LoginTexts.email.errors[error]) : undefined}
      mainButton={{
        text: t(
          isSignUp
            ? LoginTexts.email.createPassword.signUpButton
            : LoginTexts.email.createPassword.resetButton,
        ),
        onPress: onSubmit,
        disabled: !password,
        testID: 'createPasswordButton',
      }}
      footer={
        error && codeUnusableErrors.includes(error) ? (
          <EmailLoginLinkButton
            text={t(LoginTexts.email.createPassword.newCodeButton)}
            onPress={onNewCode}
            testID="newCodeButton"
          />
        ) : undefined
      }
    >
      <SessionReplayMask>
        <Section>
          {/* Lets password managers save the new password for this e-mail */}
          <TextInputSectionItem
            label={t(LoginTexts.email.createPassword.emailLabel)}
            value={email}
            editable={false}
            textContentType="username"
            autoComplete="username"
            inlineLabel={false}
            testID="createPasswordEmailInput"
          />
          <EmailPasswordInput
            kind="new"
            label={t(LoginTexts.email.createPassword.label)}
            placeholder={t(LoginTexts.email.createPassword.placeholder)}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(undefined);
            }}
            autoFocus={true}
            testID="createPasswordInput"
          />
        </Section>
      </SessionReplayMask>
      <View
        style={styles.lengthHint}
        accessible={true}
        accessibilityLabel={t(
          isLongEnough
            ? LoginTexts.email.createPassword.lengthHintMet(MIN_PASSWORD_LENGTH)
            : LoginTexts.email.createPassword.lengthHint(MIN_PASSWORD_LENGTH),
        )}
      >
        {isLongEnough && (
          <ThemeIcon svg={Check} size="small" color={textColor} />
        )}
        <ThemeText typography="body__s" color={textColor}>
          {t(LoginTexts.email.createPassword.lengthHint(MIN_PASSWORD_LENGTH))}
        </ThemeText>
      </View>
    </EmailLoginLayout>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  lengthHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
    marginTop: theme.spacing.small,
    marginHorizontal: theme.spacing.medium,
  },
}));
