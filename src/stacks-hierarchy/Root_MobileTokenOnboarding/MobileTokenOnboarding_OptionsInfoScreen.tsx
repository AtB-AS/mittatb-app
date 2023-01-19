import {MobileTokenOnboardingScreenProps} from './navigation_types';
import {useTranslation} from '@atb/translations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {Button} from '@atb/components/button';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type OptionsInfoScreenProps =
  MobileTokenOnboardingScreenProps<'MobileTokenOnboarding_OptionsInfoScreen'>;

export const MobileTokenOnboarding_OptionsInfoScreen = ({
  navigation,
}: OptionsInfoScreenProps): JSX.Element => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();

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
            >
              {t(MobileTokenOnboardingTexts.optionsInfo.heading)}
            </ThemeText>
          </View>

          <View style={styles.illustration}>
            <View style={styles.cardOrPhoneIllustration}>
              <ThemedTokenTravelCard />
              <ThemeText
                color={themeColor}
                style={styles.cardOrPhoneText}
                accessible={false}
                importantForAccessibility="no"
              >
                {t(MobileTokenOnboardingTexts.optionsInfo.or)}
              </ThemeText>
              <ThemedTokenPhone />
            </View>
          </View>
          <ThemeText color={themeColor} style={styles.description}>
            {t(MobileTokenOnboardingTexts.optionsInfo.description)}
          </ThemeText>
        </View>

        <View style={styles.buttons}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate(
                'MobileTokenOnboarding_TicketSafetyInfoScreen',
              );
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(MobileTokenOnboardingTexts.a11yNextPageHint)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
    paddingHorizontal: theme.spacings.xLarge,
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
    alignItems: 'center',
    marginVertical: theme.spacings.xLarge,
  },
  cardOrPhoneIllustration: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cardOrPhoneText: {
    marginTop: theme.spacings.xLarge,
    marginHorizontal: theme.spacings.xLarge,
  },
  description: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  buttons: {
    marginVertical: theme.spacings.medium,
  },
}));
