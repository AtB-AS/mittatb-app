import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';

import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StaticColorByType} from '@atb/theme/colors';
import {CrashSmall} from '@atb/assets/svg/color/images';
import {useAppState} from '@atb/AppContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {OnboardingFullScreenView} from '@atb/onboarding-frame';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function NoTravelTokenInfo({close}: {close: () => void}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {
    completeMobileTokenOnboarding,
    completeMobileTokenWithoutTravelcardOnboarding,
  } = useAppState();
  const {disable_travelcard} = useRemoteConfig();

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: () => {
          disable_travelcard
            ? completeMobileTokenWithoutTravelcardOnboarding()
            : completeMobileTokenOnboarding();
          close();
        },
        text: t(MobileTokenOnboardingTexts.ok),
      }}
    >
      <ThemeText type="heading--big" style={styles.header} color={themeColor}>
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
    marginBottom: theme.spacings.xLarge,
    textAlign: 'center',
  },
  illustration: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacings.xLarge,
  },
  description: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
}));
