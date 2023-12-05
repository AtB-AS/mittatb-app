import {RootStackScreenProps} from './navigation-types';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';

import {FullScreenFooter} from '@atb/components/screen-footer';
import {FullScreenHeader} from '@atb/components/screen-header';
import {
  ConsiderTravelTokenChangeTexts,
  useTranslation,
} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useAppState} from '@atb/AppContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {Phone} from '@atb/assets/svg/color/illustrations/token/mobile/dark';

import {useMobileTokenContextState} from '@atb/mobile-token';
import {getDeviceNameWithUnitInfo} from '@atb/select-travel-token-screen/utils';

type Props = RootStackScreenProps<'Root_ConsiderTravelTokenChangeScreen'>;

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ConsiderTravelTokenChangeScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad();
  const styles = useStyle();
  const {t} = useTranslation();

  const {disable_travelcard} = useRemoteConfig();

  const {
    completeMobileTokenOnboarding,
    completeMobileTokenWithoutTravelcardOnboarding,
  } = useAppState();

  return (
    <View style={styles.container}>
      <FullScreenHeader setFocusOnLoad={false} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        ref={focusRef}
      >
        <View style={styles.mainContent}>
          <ThemeText
            type="heading--big"
            color={themeColor}
            style={styles.header}
          >
            {t(ConsiderTravelTokenChangeTexts.title)}
          </ThemeText>
          <ThemeText
            type="body__primary"
            color={themeColor}
            style={styles.description}
          >
            {t(ConsiderTravelTokenChangeTexts.description)}
          </ThemeText>
          <ActiveTokenInfoBox
            onPressChangeButton={() =>
              navigation.navigate('Root_SelectTravelTokenScreen')
            }
          />
        </View>
      </ScrollView>
      <FullScreenFooter>
        <Button
          interactiveColor="interactive_0"
          mode="primary"
          onPress={() => {
            disable_travelcard
              ? completeMobileTokenWithoutTravelcardOnboarding()
              : completeMobileTokenOnboarding();
            navigation.goBack();
          }}
          style={styles.button}
          text={t(ConsiderTravelTokenChangeTexts.nextButton)}
          testID="continueWithoutChangingTravelTokenButton"
        />
      </FullScreenFooter>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    marginHorizontal: theme.spacings.xLarge,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    margin: theme.spacings.xLarge,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    marginBottom: theme.spacings.xLarge,
  },
  button: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.medium,
  },
}));

type ActiveTokenInfoBoxProps = {onPressChangeButton: () => void};

const ActiveTokenInfoBox = ({onPressChangeButton}: ActiveTokenInfoBoxProps) => {
  const styles = useActiveTokenInfoBoxStyle();
  const {t} = useTranslation();

  const {tokens} = useMobileTokenContextState();
  const inspectableToken = tokens.find((t) => t.isInspectable);
  const isTravelCard = inspectableToken?.type === 'travel-card';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Phone />
        <View style={styles.activeTokenInfo}>
          <ThemeText type="body__primary" color={themeColor}>
            {t(
              ConsiderTravelTokenChangeTexts.activeTokenInfoBox.title(
                isTravelCard,
              ),
            )}
          </ThemeText>
          <ThemeText type="body__primary--bold" color={themeColor}>
            {isTravelCard
              ? inspectableToken?.name
              : getDeviceNameWithUnitInfo(t, inspectableToken, true)}
          </ThemeText>
        </View>
      </View>
      <Button
        interactiveColor="interactive_0"
        mode="secondary"
        onPress={onPressChangeButton}
        text={t(ConsiderTravelTokenChangeTexts.activeTokenInfoBox.change)}
        testID="continueWithoutChangingTravelTokenButton"
      />
    </View>
  );
};

const useActiveTokenInfoBoxStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_1.background,
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
}));
