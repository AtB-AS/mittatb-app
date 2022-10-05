import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import Button from '@atb/components/button';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeText from '@atb/components/text';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {LoginTexts, useTranslation} from '@atb/translations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {LoginInAppRootProps} from './types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

// @TODO Is this even in use?

export type SkipLoginWarningProps = LoginInAppRootProps;

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
