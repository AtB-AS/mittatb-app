import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import ThemeText from '@atb/components/text';
import {PhoneSignInErrorCode} from '@atb/auth/AuthContext';
import MessageBox from '@atb/components/message-box';
import {useNavigation} from '@react-navigation/native';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {onboardingThemeColor} from '@atb/screens/Onboarding';

export default function PhoneInput({
  loginReason,
  doAfterLogin,
  headerLeftButton,
  headerRightButton,
}: {
  loginReason?: string;
  doAfterLogin: (phoneNumber: string) => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();
  const navigation = useNavigation();
  const focusRef = useFocusOnLoad();

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsSubmitting(false);
      }),
    [navigation],
  );

  const onNext = async () => {
    setIsSubmitting(true);
    const errorCode = await signInWithPhoneNumber(phoneNumber);
    if (!errorCode) {
      setError(undefined);
      doAfterLogin(phoneNumber);
    } else {
      setIsSubmitting(false);
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={headerLeftButton}
        rightButton={headerRightButton}
        setFocusOnLoad={false}
        color={onboardingThemeColor}
      />

      <View style={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            color={onboardingThemeColor}
          >
            {t(LoginTexts.phoneInput.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          {loginReason && (
            <ThemeText style={styles.loginReason} color={onboardingThemeColor}>
              {loginReason}
            </ThemeText>
          )}
          <ThemeText style={styles.description} color={onboardingThemeColor}>
            {t(LoginTexts.phoneInput.description)}
          </ThemeText>
        </View>
        <Sections.Section>
          <Sections.GenericItem>
            <ThemeText>{t(LoginTexts.phoneInput.input.heading)}</ThemeText>
          </Sections.GenericItem>
          <Sections.TextInput
            label={t(LoginTexts.phoneInput.input.label)}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            showClear={true}
            keyboardType="phone-pad"
            placeholder={t(LoginTexts.phoneInput.input.placeholder)}
          />
        </Sections.Section>
        <View style={styles.buttonView}>
          {isSubmitting && (
            <ActivityIndicator color={theme.text.colors.primary} size="large" />
          )}

          {error && !isSubmitting && (
            <MessageBox
              containerStyle={styles.errorMessage}
              type="error"
              message={t(LoginTexts.phoneInput.errors[error])}
            />
          )}

          {!isSubmitting && (
            <Button
              color={'secondary_1'}
              onPress={onNext}
              text={t(LoginTexts.phoneInput.mainButton)}
              disabled={phoneNumber.length !== 8}
              icon={ArrowRight}
              iconPosition="right"
            />
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
    marginBottom: theme.spacings.medium,
  },
  loginReason: {marginTop: theme.spacings.medium},
  description: {marginVertical: theme.spacings.medium},
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
}));
