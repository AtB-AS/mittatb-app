import React, {useState} from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {LoginTexts, PhoneInputTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useTheme} from '@atb/theme';
import {PhoneSignInErrorCode, useAuthState} from '@atb/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StaticColorByType, getStaticColor} from '@atb/theme/colors';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';

import {TransitionPresets} from '@react-navigation/stack';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import phone from 'phone';
import {GlobalMessageContextEnum} from '@atb/global-messages';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginPhoneInputScreen'>;

export const Root_LoginPhoneInputScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const focusRef = useFocusOnLoad();
  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();
  const {themeName} = useTheme();

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
    setIsSubmitting(true);
    if (!phoneValidation.phoneNumber) {
      setIsSubmitting(false);
      setError('invalid_phone');
      return;
    }

    const result = await signInWithPhoneNumber(phoneValidation.phoneNumber);

    setIsSubmitting(false);

    if (result) {
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
        leftButton={{
          type:
            params?.transitionPreset ===
            TransitionPresets.ModalSlideFromBottomIOS
              ? 'close'
              : 'back',
        }}
        setFocusOnLoad={false}
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
              type="body__primary--jumbo--bold"
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
              keyboardType="number-pad"
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
                color={getStaticColor(themeName, themeColor).text}
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
                style={styles.submitButton}
                interactiveColor="interactive_0"
                onPress={onNext}
                text={t(LoginTexts.phoneInput.mainButton)}
                disabled={!isValidPhoneNumber}
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
  phoneInput: {
    marginVertical: theme.spacings.xSmall,
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
