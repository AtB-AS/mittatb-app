import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';

import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import React from 'react';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

import {OnboardingFullScreenView} from '@atb/modules/onboarding';
import {ThemedCrashSmall} from '@atb/theme/ThemedAssets';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export function NoTravelTokenInfo({
  onPressFooterButton,
}: {
  onPressFooterButton: () => void;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  const {disable_travelcard} = useRemoteConfigContext();

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: onPressFooterButton,
        text: t(MobileTokenOnboardingTexts.ok),
        expanded: true,
      }}
    >
      <ThemeText
        typography="heading--big"
        style={styles.header}
        color={themeColor}
      >
        {t(MobileTokenOnboardingTexts.error.heading)}
      </ThemeText>
      <ThemeText style={styles.description} color={themeColor}>
        {disable_travelcard
          ? t(MobileTokenOnboardingTexts.withoutTravelcard.error.description)
          : t(MobileTokenOnboardingTexts.error.description)}
      </ThemeText>
      <View style={styles.illustration}>
        <ThemedCrashSmall />
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
