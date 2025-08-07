import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';

import {
  ConsiderTravelTokenChangeTexts,
  useTranslation,
} from '@atb/translations';

import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {NoTravelTokenInfo} from './components/NoTravelTokenInfo';
import {
  OnboardingFullScreenView,
  useOnboardingNavigation,
} from '@atb/modules/onboarding';
import {TravelTokenBox} from '@atb/travel-token-box';
import {LoadingScreen} from '@atb/screen-components/loading-screen';
import {View} from 'react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useCallback} from 'react';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

export const Root_ConsiderTravelTokenChangeScreen = () => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];
  const focusRef = useFocusOnLoad();
  const {disable_travelcard} = useRemoteConfigContext();

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

  const {tokens, mobileTokenStatus} = useMobileTokenContext();

  if (mobileTokenStatus === 'loading') return <LoadingScreen />;

  if (mobileTokenStatus === 'error' || mobileTokenStatus === 'fallback')
    return NoTokenView;

  const hasInspectableToken = tokens.some((token) => token.isInspectable);
  if (!hasInspectableToken) return NoTokenView;

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: onPressContinue,
        text: t(ConsiderTravelTokenChangeTexts.nextButton),
        expanded: true,
      }}
    >
      <View ref={focusRef} accessible>
        <ThemeText
          typography="heading--big"
          color={themeColor}
          style={styles.header}
        >
          {t(ConsiderTravelTokenChangeTexts.title)}
        </ThemeText>
      </View>
      <ThemeText
        typography="body__primary"
        color={themeColor}
        style={styles.description}
      >
        {t(ConsiderTravelTokenChangeTexts.description)}
      </ThemeText>
      <TravelTokenBox showIfThisDevice={true} alwaysShowErrors={true} />
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
