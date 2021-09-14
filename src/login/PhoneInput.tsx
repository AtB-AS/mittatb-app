import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
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
import {ThemeColor} from '@atb/theme/colors';

const themeColor: ThemeColor = 'background_gray';

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

  // Remove whitespaces from phone number
  const setCleanPhoneNumber = (number: string) =>
    setPhoneNumber(number.replace(/\s+/g, ''));

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
        color={themeColor}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          centerContent={true}
          style={styles.scrollView}
        >
          <View accessible={true} accessibilityRole="header" ref={focusRef}>
            <ThemeText
              type={'body__primary--jumbo--bold'}
              style={styles.title}
              color={themeColor}
            >
              {t(LoginTexts.phoneInput.title)}
            </ThemeText>
          </View>
          <View accessible={true}>
            {loginReason && (
              <ThemeText style={styles.loginReason} color={themeColor}>
                {loginReason}
              </ThemeText>
            )}
            <ThemeText style={styles.description} color={themeColor}>
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
              onChangeText={setCleanPhoneNumber}
              showClear={true}
              keyboardType="number-pad"
              placeholder={t(LoginTexts.phoneInput.input.placeholder)}
              autoFocus={true}
              textContentType="telephoneNumber"
            />
          </Sections.Section>
          <View style={styles.buttonView}>
            {isSubmitting && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
              />
            )}

            {error && !isSubmitting && (
              <MessageBox
                containerStyle={styles.errorMessage}
                type="error"
                message={t(LoginTexts.phoneInput.errors.invalid_phone)}
              />
            )}

            {!isSubmitting && (
              <Button
                style={styles.submitButton}
                color={'primary_2'}
                onPress={onNext}
                text={t(LoginTexts.phoneInput.mainButton)}
                disabled={phoneNumber.length !== 8}
                icon={ArrowRight}
                iconPosition="right"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    margin: theme.spacings.large,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  loginReason: {
    marginTop: theme.spacings.medium,
    textAlign: 'center',
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
  },
  activityIndicator: {
    marginVertical: theme.spacings.large,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  submitButton: {
    marginTop: theme.spacings.medium,
  },
}));
