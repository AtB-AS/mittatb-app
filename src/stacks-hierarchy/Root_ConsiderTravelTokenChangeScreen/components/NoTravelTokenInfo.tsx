import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';

import {StyleSheet, Theme, useTheme} from '@atb/theme';
import React from 'react';
import {CrashSmall} from '@atb/assets/svg/color/images';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {OnboardingFullScreenView} from '@atb/onboarding';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export function NoTravelTokenInfo({
  onPressFooterButton,
}: {
  onPressFooterButton: () => void;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);

  const {disable_travelcard} = useRemoteConfig();

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: onPressFooterButton,
        text: t(MobileTokenOnboardingTexts.ok),
      }}
    >
      <ThemeText typography="heading--big" style={styles.header} color={themeColor}>
        {t(MobileTokenOnboardingTexts.error.heading)}
      </ThemeText>
      <ThemeText style={styles.description} color={themeColor}>
        {disable_travelcard
          ? t(MobileTokenOnboardingTexts.withoutTravelcard.error.description)
          : t(MobileTokenOnboardingTexts.error.description)}
      </ThemeText>
      <View style={styles.illustration}>
        <CrashSmall />
      </View>
    </OnboardingFullScreenView>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    marginBottom: theme.spacing.xLarge,
    textAlign: 'center',
  },
  illustration: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.xLarge,
  },
  description: {
    marginTop: theme.spacing.xLarge,
    textAlign: 'center',
  },
}));
