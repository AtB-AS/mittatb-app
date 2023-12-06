import {RootStackScreenProps} from '../navigation-types';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';

import {
  ConsiderTravelTokenChangeTexts,
  useTranslation,
} from '@atb/translations';
import {useAppState} from '@atb/AppContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {Phone} from '@atb/assets/svg/color/illustrations/token/mobile/dark';

import {Token, useMobileTokenContextState} from '@atb/mobile-token';
import {TravelDeviceTitle} from '@atb/travel-token-box';
import {NoTravelTokenInfo} from './components/NoTravelTokenInfo';
import {OnboardingFrame} from '@atb/onboarding-frame';

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

  if (mobileTokenStatus !== 'success') return NoTokenView;

  const inspectableToken = tokens.find((token) => token.isInspectable);
  if (!inspectableToken) return NoTokenView;

  return (
    <OnboardingFrame
      footerButton={{
        onPress: () => {
          disable_travelcard
            ? completeMobileTokenWithoutTravelcardOnboarding()
            : completeMobileTokenOnboarding();
          navigation.goBack();
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
      <ActiveTravelTokenInfoBox
        onPressChangeButton={() =>
          navigation.navigate('Root_SelectTravelTokenScreen')
        }
        inspectableToken={inspectableToken}
      />
    </OnboardingFrame>
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

const activeTravelTokenInfoBoxThemeColor: StaticColorByType<'background'> =
  'background_accent_1';

type ActiveTravelTokenInfoBoxProps = {
  onPressChangeButton: () => void;
  inspectableToken: Token;
};

const ActiveTravelTokenInfoBox = ({
  onPressChangeButton,
  inspectableToken,
}: ActiveTravelTokenInfoBoxProps) => {
  const styles = useActiveTravelTokenInfoBoxStyle();
  const {t} = useTranslation();

  const isTravelCard = inspectableToken?.type === 'travel-card';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Phone />
        <View style={styles.activeTokenInfo}>
          <ThemeText
            type="body__primary"
            color={activeTravelTokenInfoBoxThemeColor}
          >
            {t(
              ConsiderTravelTokenChangeTexts.activeTravelTokenInfoBox.title(
                isTravelCard,
              ),
            )}
          </ThemeText>
          {inspectableToken && (
            <TravelDeviceTitle
              inspectableToken={inspectableToken}
              includeTravelCardTitle={false}
            />
          )}
        </View>
      </View>
      <Button
        interactiveColor="interactive_0"
        mode="secondary"
        onPress={onPressChangeButton}
        text={t(ConsiderTravelTokenChangeTexts.activeTravelTokenInfoBox.change)}
        testID="continueWithoutChangingTravelTokenButton"
      />
    </View>
  );
};

const useActiveTravelTokenInfoBoxStyle = StyleSheet.createThemeHook(
  (theme) => ({
    container: {
      backgroundColor:
        theme.static.background[activeTravelTokenInfoBoxThemeColor].background,
      padding: theme.spacings.xLarge,
      borderRadius: theme.border.radius.regular,
    },
    content: {
      marginBottom: theme.spacings.large,
      display: 'flex',
      flexDirection: 'row',
    },
    activeTokenInfo: {
      flex: 1,
      marginLeft: theme.spacings.medium,
    },
  }),
);
