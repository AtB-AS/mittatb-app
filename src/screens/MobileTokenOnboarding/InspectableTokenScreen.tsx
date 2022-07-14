import {useTranslation} from '@atb/translations';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StaticColorByType} from '@atb/theme/colors';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {usePreferenceItems} from '@atb/preferences';
import TravelTokenBox from '@atb/travel-token-box';
import {RemoteToken} from '@atb/mobile-token/types';
import {useAppState} from '@atb/AppContext';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {MobileTokenTabParams} from '@atb/screens/MobileTokenOnboarding/index';
import {isTravelCardToken} from '@atb/mobile-token/utils';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function InspectableTokenScreen({
  inspectableToken,
  navigation,
}: {
  inspectableToken: RemoteToken;
  navigation: MaterialTopTabNavigationProp<MobileTokenTabParams>;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();
  const {startScreen} = usePreferenceItems();
  const {completeMobileTokenOnboarding} = useAppState();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
    >
      <View style={styles.viewContent}>
        <View style={styles.mainView}>
          <View accessible={true} ref={focusRef}>
            <ThemeText
              type="heading--jumbo"
              style={styles.header}
              color={themeColor}
              isMarkdown={true}
            >
              {isTravelCardToken(inspectableToken)
                ? t(MobileTokenOnboardingTexts.tCard.heading)
                : t(MobileTokenOnboardingTexts.phone.heading)}
            </ThemeText>
          </View>
          <View style={styles.illustration}>
            <TravelTokenBox showIfThisDevice={true} alwaysShowErrors={true} />
          </View>
          <ThemeText
            style={styles.description}
            color={themeColor}
            isMarkdown={true}
          >
            {isTravelCardToken(inspectableToken)
              ? t(MobileTokenOnboardingTexts.tCard.description)
              : t(MobileTokenOnboardingTexts.phone.description)}
          </ThemeText>
        </View>
        <View style={styles.buttons}>
          <Button
            onPress={() => {
              completeMobileTokenOnboarding();
            }}
            text={t(MobileTokenOnboardingTexts.ok)}
            testID="nextButton"
            style={styles.okButton}
          />
          <Button
            interactiveColor="interactive_1"
            mode="secondary"
            onPress={() => {
              navigation.navigate('SelectTravelToken');
            }}
            text={
              isTravelCardToken(inspectableToken)
                ? t(MobileTokenOnboardingTexts.tCard.button)
                : t(MobileTokenOnboardingTexts.phone.button)
            }
            testID="switchButton"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.xLarge,
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  containerContent: {
    paddingTop: theme.spacings.xLarge,
    flexGrow: 1,
  },
  viewContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainView: {
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: theme.spacings.xLarge,
    textAlign: 'center',
  },
  illustration: {
    minHeight: 180,
    justifyContent: 'center',
    marginVertical: theme.spacings.xLarge,
  },
  description: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  buttons: {
    marginVertical: theme.spacings.medium,
  },
  okButton: {
    marginBottom: theme.spacings.medium,
  },
}));
