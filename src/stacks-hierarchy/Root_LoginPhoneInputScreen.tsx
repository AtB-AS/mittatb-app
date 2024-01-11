import React from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {LoginTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {useAuthState} from '@atb/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StaticColorByType} from '@atb/theme/colors';
import {PhoneInput} from '@atb/components/phone-input';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';

import {TransitionPresets} from '@react-navigation/stack';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginPhoneInputScreen'>;

export const Root_LoginPhoneInputScreen = ({
  navigation,
  route: {
    params: {afterLogin, transitionPreset},
  },
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const focusRef = useFocusOnLoad();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{
          type:
            transitionPreset === TransitionPresets.ModalSlideFromBottomIOS
              ? 'close'
              : 'back',
        }}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(LoginTexts.phoneInput.title)}
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
          <PhoneInput
            submitButtonText={t(LoginTexts.phoneInput.mainButton)}
            submitButtonTestId="sendCodeButton"
            onSubmitPromise={signInWithPhoneNumber}
            onSubmitAction={(number) => {
              navigation.navigate('Root_LoginConfirmCodeScreen', {
                afterLogin,
                phoneNumber: number,
              });
            }}
            rightIcon={ArrowRight}
          />
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
