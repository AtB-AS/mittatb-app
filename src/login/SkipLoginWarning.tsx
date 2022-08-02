import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParams} from '@atb/screens/Onboarding';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type SkipLoginWarningProps = {
  navigation: StackNavigationProp<OnboardingStackParams>;
};

export default function SkipLoginWarning({navigation}: SkipLoginWarningProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();
  const finishOnboarding = useFinishOnboarding();

  return (
    <View style={styles.container}>
      <FullScreenHeader leftButton={{type: 'back'}} setFocusOnLoad={false} />

      <ScrollView style={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText type={'body__primary--jumbo--bold'} color={themeColor}>
            {t(LoginTexts.skipLoginWarning.title)}
          </ThemeText>
        </View>
        <View>
          <ThemeText style={styles.description} color={themeColor}>
            {t(LoginTexts.skipLoginWarning.description)}
          </ThemeText>
        </View>
      </ScrollView>
      <FullScreenFooter>
        <Button
          interactiveColor="interactive_0"
          onPress={finishOnboarding}
          text={t(LoginTexts.skipLoginWarning.mainButton)}
          icon={ArrowRight}
          iconPosition="right"
        />
        <TouchableOpacity
          style={styles.goToLoginButton}
          onPress={navigation.goBack}
          accessibilityRole="button"
        >
          <ThemeText
            style={styles.goToLoginButtonText}
            type="body__primary--underline"
            color={themeColor}
          >
            {t(LoginTexts.skipLoginWarning.wantToLoginButton)}
          </ThemeText>
        </TouchableOpacity>
      </FullScreenFooter>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    margin: theme.spacings.medium,
    flex: 1,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  description: {marginTop: theme.spacings.medium},
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  goToLoginButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  goToLoginButtonText: {textAlign: 'center'},
}));
