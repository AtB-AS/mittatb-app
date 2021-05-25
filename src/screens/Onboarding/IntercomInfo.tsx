import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import Illustration from '@atb/screens/Onboarding/components/Illustration';
import {Onboarding2} from '@atb/assets/svg/illustrations';
import {Confirm} from '@atb/assets/svg/icons/actions';

export default function IntercomInfo() {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();
  const finishOnboarding = useFinishOnboarding();

  return (
    <View style={styles.container}>
      <FullScreenHeader setFocusOnLoad={false} style={styles.header} />

      <Illustration Svg={Onboarding2} />
      <ScrollView style={styles.mainView}>
        <View ref={focusRef} accessibilityRole="header" accessible={true}>
          <ThemeText type={'body__primary--bold'} style={styles.title}>
            {t(OnboardingTexts.intercom.title)}
          </ThemeText>
        </View>
        <View>
          <ThemeText style={styles.description}>
            {t(OnboardingTexts.intercom.description)}
          </ThemeText>
        </View>
      </ScrollView>
      <FullScreenFooter>
        <Button
          color={'secondary_1'}
          onPress={finishOnboarding}
          text={t(OnboardingTexts.intercom.mainButton)}
          icon={Confirm}
          iconPosition="right"
        />
      </FullScreenFooter>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.primary_3.backgroundColor,
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.primary_3.backgroundColor,
  },
  mainView: {
    margin: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
    flex: 1,
  },
  title: {
    color: theme.colors.primary_3.color,
  },
  description: {
    marginTop: theme.spacings.medium,
    color: theme.colors.primary_3.color,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  resendButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
