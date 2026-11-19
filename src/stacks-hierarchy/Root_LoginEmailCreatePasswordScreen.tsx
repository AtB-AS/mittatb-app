import React, {useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  isValidPassword,
  MIN_PASSWORD_LENGTH,
  setPendingEmailPassword,
} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {SessionReplayMask} from '@atb/modules/analytics';
import {EmailLoginLayout} from './login-email/EmailLoginLayout';

type Props = RootStackScreenProps<'Root_LoginEmailCreatePasswordScreen'>;

/**
 * Choose a password for sign-up or reset. The code is entered on the next
 * screen, and the password is sent together with it (D15).
 */
export const Root_LoginEmailCreatePasswordScreen = ({
  navigation,
  route,
}: Props) => {
  const {email, purpose} = route.params;
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad(navigation, false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const onNext = () => {
    if (!isValidPassword(password)) {
      setShowError(true);
      return;
    }
    setPendingEmailPassword(password);
    navigation.navigate('Root_LoginEmailConfirmCodeScreen', {email, purpose});
  };

  return (
    <EmailLoginLayout
      title={t(
        purpose === 'signup'
          ? LoginTexts.email.createPassword.signUpTitle
          : LoginTexts.email.createPassword.resetTitle,
      )}
      description={t(
        LoginTexts.email.createPassword.description(MIN_PASSWORD_LENGTH),
      )}
      focusRef={focusRef}
      isLoading={false}
      errorMessage={
        showError ? t(LoginTexts.email.errors.weak_password) : undefined
      }
      mainButton={{
        text: t(LoginTexts.email.createPassword.mainButton),
        onPress: onNext,
        disabled: !password,
        testID: 'createPasswordButton',
      }}
    >
      <SessionReplayMask>
        <Section>
          <TextInputSectionItem
            label={t(LoginTexts.email.createPassword.label)}
            placeholder={t(LoginTexts.email.createPassword.placeholder)}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setShowError(false);
            }}
            secureTextEntry={true}
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
            autoCorrect={false}
            inlineLabel={false}
            autoFocus={true}
            testID="createPasswordInput"
          />
        </Section>
      </SessionReplayMask>
    </EmailLoginLayout>
  );
};
