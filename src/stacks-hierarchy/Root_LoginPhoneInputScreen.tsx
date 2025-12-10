import React, {useState} from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {LoginTexts, PhoneInputTexts, useTranslation} from '@atb/translations';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {PhoneSignInErrorCode, useAuthContext} from '@atb/modules/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';

import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import phone from 'phone';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {useRateLimitWhen} from '@atb/utils/use-rate-limit-when';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_LoginPhoneInputScreen'>;

export const Root_LoginPhoneInputScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {signInWithPhoneNumber} = useAuthContext();
  const focusRef = useFocusOnLoad(navigation, false);
  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();
  const {isRateLimited, rateLimitIfNeeded} =
    useRateLimitWhen<PhoneSignInErrorCode>(
      (code) => code === 'too_many_attempts',
    );

  const phoneValidationParams = {
    strictDetection: true,
    validateMobilePrefix: false,
  };

  const phoneValidation = phone(
    '+' + prefix + phoneNumber,
    phoneValidationParams,
  );

  const isValidPhoneNumber = phoneValidation.isValid;

  const onNext = async () => {
    if (isRateLimited) return;
    setIsSubmitting(true);
    if (!phoneValidation.phoneNumber) {
      setIsSubmitting(false);
      setError('invalid_phone');
      return;
    }

    const result = await signInWithPhoneNumber(phoneValidation.phoneNumber);

    setIsSubmitting(false);

    if (result) {
      rateLimitIfNeeded(result);
      setError(result);
    } else {
      setError(undefined);
      navigation.navigate('Root_LoginConfirmCodeScreen', {
        phoneNumber: phoneValidation.phoneNumber,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={
          params?.transitionOverride !== 'slide-from-bottom'
            ? {type: 'back'}
            : undefined
        }
        rightButton={
          params?.transitionOverride === 'slide-from-bottom'
            ? {type: 'close'}
            : undefined
        }
        focusRef={focusRef}
        color={themeColor}
        title={t(LoginTexts.phoneInput.title)}
        globalMessageContext={GlobalMessageContextEnum.appLoginPhone}
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
              typography="heading__3xl"
              style={styles.title}
              color={themeColor}
            >
              {t(LoginTexts.phoneInput.title)}
            </ThemeText>
          </View>
          <View accessible={true}>
            <ThemeText style={styles.description} color={themeColor}>
              {t(LoginTexts.phoneInput.description)}
            </ThemeText>
          </View>
          <Section style={styles.phoneInput}>
            <PhoneInputSectionItem
              label={t(PhoneInputTexts.input.title)}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setError(undefined);
              }}
              prefix={prefix}
              onChangePrefix={setPrefix}
              showClear={true}
              placeholder={t(PhoneInputTexts.input.placeholder.login)}
              autoFocus={true}
              textContentType="telephoneNumber"
            />
          </Section>

          <View style={styles.buttonView}>
            {isSubmitting && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color={themeColor.foreground.primary}
              />
            )}

            {error && !isSubmitting && (
              <MessageInfoBox
                style={styles.errorMessage}
                type="error"
                message={t(PhoneInputTexts.errors[error])}
              />
            )}

            {!isSubmitting && (
              <Button
                expanded={true}
                style={styles.submitButton}
                interactiveColor={theme.color.interactive[0]}
                onPress={onNext}
                text={t(LoginTexts.phoneInput.mainButton)}
                disabled={!isValidPhoneNumber || isRateLimited}
                testID="sendCodeButton"
                rightIcon={{svg: ArrowRight}}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: theme.spacing.xLarge,
  },
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  description: {
    marginVertical: theme.spacing.large,
    textAlign: 'center',
  },
  phoneInput: {
    marginVertical: theme.spacing.xSmall,
  },
  activityIndicator: {
    marginVertical: theme.spacing.large,
  },
  errorMessage: {
    marginBottom: theme.spacing.medium,
  },
  buttonView: {
    marginTop: theme.spacing.medium,
  },
  submitButton: {
    marginTop: theme.spacing.medium,
  },
}));
