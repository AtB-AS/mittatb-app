import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';

import {
  ConsiderTravelTokenChangeTexts,
  useTranslation,
} from '@atb/translations';

import {useMobileTokenContextState} from '@atb/mobile-token';
import {NoTravelTokenInfo} from './components/NoTravelTokenInfo';
import {
  OnboardingFullScreenView,
  useOnboardingNavigation,
} from '@atb/onboarding';
import {TravelTokenBox} from '@atb/travel-token-box';
import {LoadingScreen} from '@atb/loading-screen';
import {View} from 'react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useCallback} from 'react';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export const Root_ConsiderTravelTokenChangeScreen = () => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = theme.color.background.accent[0];
  const interactiveColor = theme.color.interactive[1];
  const focusRef = useFocusOnLoad();
  const {disable_travelcard} = useRemoteConfig();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const onPressContinue = useCallback(
    () =>
      continueFromOnboardingSection(
        disable_travelcard ? 'mobileTokenWithoutTravelcard' : 'mobileToken',
      ),
    [continueFromOnboardingSection, disable_travelcard],
  );

  const NoTokenView = (
    <NoTravelTokenInfo onPressFooterButton={onPressContinue} />
  );

  const {tokens, mobileTokenStatus} = useMobileTokenContextState();

  if (mobileTokenStatus === 'loading') return <LoadingScreen />;

  if (
    mobileTokenStatus === 'error' ||
    mobileTokenStatus === 'fallback'
  )
    return NoTokenView;

  const hasInspectableToken = tokens.some((token) => token.isInspectable);
  if (!hasInspectableToken) return NoTokenView;

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: onPressContinue,
        text: t(ConsiderTravelTokenChangeTexts.nextButton),
      }}
    >
      <View ref={focusRef} accessible>
        <ThemeText type="heading--big" color={themeColor} style={styles.header}>
          {t(ConsiderTravelTokenChangeTexts.title)}
        </ThemeText>
      </View>
      <ThemeText
        type="body__primary"
        color={themeColor}
        style={styles.description}
      >
        {t(ConsiderTravelTokenChangeTexts.description)}
      </ThemeText>
      <TravelTokenBox
        showIfThisDevice={true}
        alwaysShowErrors={true}
        interactiveColor={interactiveColor}
      />
    </OnboardingFullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    margin: theme.spacing.xLarge,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    marginBottom: theme.spacing.xLarge,
  },
}));
