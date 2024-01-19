import React, {useState} from 'react';
import {LoginTexts, useTranslation} from '@atb/translations';
import {
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
  useAuthState,
} from '@atb/auth';
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
import {loginConfirmCodeInputId} from '@atb/test-ids';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColorByType} from '@atb/theme/colors';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useAppState} from '@atb/AppContext';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginConfirmCodeScreen'>;

export const Root_LoginConfirmCodeScreen = ({route}: Props) => {
  const {phoneNumber} = route.params;
  const {t} = useTranslation();
  const styles = useStyles();
  const {themeName} = useTheme();
  const {confirmCode, signInWithPhoneNumber} = useAuthState();
  const [code, setCode] = useState('');
  const [error, setError] = useState<
    ConfirmationErrorCode | PhoneSignInErrorCode
  >();
  const [isLoading, setIsLoading] = useState(false);
  const focusRef = useFocusOnLoad();
  const {completeOnboarding} = useAppState();

  const onLogin = async () => {
    setIsLoading(true);
    completeOnboarding();
    const errorCode = await confirmCode(code);
    if (errorCode) {
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
              type="body__primary--jumbo--bold"
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
              testID={loginConfirmCodeInputId}
            />
          </Section>
          <View style={styles.buttonView}>
            {isLoading && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color={getStaticColor(themeName, themeColor).text}
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
                  interactiveColor="interactive_0"
                  onPress={onLogin}
                  text={t(LoginTexts.confirmCode.mainButton)}
                  disabled={!code}
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
                    type="body__primary--underline"
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
