import {RootStackScreenProps} from '../navigation-types';
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
import {OnboardingFullScreenView} from '@atb/onboarding-frame';
import {TravelTokenBox} from '@atb/travel-token-box';
import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';
import {LoadingScreen} from '@atb/loading-screen';

type Props = RootStackScreenProps<'Root_ConsiderTravelTokenChangeScreen'>;

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ConsiderTravelTokenChangeScreen = ({navigation}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();

  const {disable_travelcard} = useRemoteConfig();

  const {
    completeMobileTokenOnboarding,
    completeMobileTokenWithoutTravelcardOnboarding,
  } = useAppState();

  const NoTokenView = <NoTravelTokenInfo close={navigation.pop} />;
  const {tokens, mobileTokenStatus} = useMobileTokenContextState();

  const {continueFromOnboardingScreen} = useOnboardingNavigationFlow();

  if (mobileTokenStatus === 'loading') return <LoadingScreen />;

  if (mobileTokenStatus !== 'success') return NoTokenView;

  const inspectableToken = tokens.find((token) => token.isInspectable);
  if (!inspectableToken) return NoTokenView;

  return (
    <OnboardingFullScreenView
      footerButton={{
        onPress: () => {
          disable_travelcard
            ? completeMobileTokenWithoutTravelcardOnboarding()
            : completeMobileTokenOnboarding();

          continueFromOnboardingScreen('Root_ConsiderTravelTokenChangeScreen');
        },
        text: t(ConsiderTravelTokenChangeTexts.nextButton),
      }}
    >
      <ThemeText type="heading--big" color={themeColor} style={styles.header}>
        {t(ConsiderTravelTokenChangeTexts.title)}
      </ThemeText>
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
