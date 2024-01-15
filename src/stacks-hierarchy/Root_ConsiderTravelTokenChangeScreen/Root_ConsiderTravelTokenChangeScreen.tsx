import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';

import {
  ConsiderTravelTokenChangeTexts,
  useTranslation,
} from '@atb/translations';
import {useAppState} from '@atb/AppContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {useMobileTokenContextState} from '@atb/mobile-token';
import {NoTravelTokenInfo} from './components/NoTravelTokenInfo';
import {OnboardingFullScreenView} from '@atb/onboarding-screen';
import {TravelTokenBox} from '@atb/travel-token-box';
import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';
import {LoadingScreen} from '@atb/loading-screen';
import {View} from 'react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useCallback} from 'react';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ConsiderTravelTokenChangeScreen = () => {
  const styles = useStyle();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();

  const {disable_travelcard} = useRemoteConfig();

  const {
    completeMobileTokenOnboarding,
    completeMobileTokenWithoutTravelcardOnboarding,
  } = useAppState();
  const {continueFromOnboardingScreen} = useOnboardingNavigationFlow();

  const onPressContinue = useCallback(() => {
    disable_travelcard
      ? completeMobileTokenWithoutTravelcardOnboarding()
      : completeMobileTokenOnboarding();

    continueFromOnboardingScreen('Root_ConsiderTravelTokenChangeScreen');
  }, [
    completeMobileTokenOnboarding,
    completeMobileTokenWithoutTravelcardOnboarding,
    continueFromOnboardingScreen,
    disable_travelcard,
  ]);

  const NoTokenView = (
    <NoTravelTokenInfo onPressFooterButton={onPressContinue} />
  );

  const {tokens, mobileTokenStatus} = useMobileTokenContextState();

  if (mobileTokenStatus === 'loading') return <LoadingScreen />;

  if (mobileTokenStatus !== 'success') return NoTokenView;

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
        interactiveColor="interactive_1"
      />
    </OnboardingFullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    margin: theme.spacings.xLarge,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    marginBottom: theme.spacings.xLarge,
  },
}));
