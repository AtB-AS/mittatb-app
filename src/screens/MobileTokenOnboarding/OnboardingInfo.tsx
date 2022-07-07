import React from 'react';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Button from '@atb/components/button';
import TravelPlanning from '@atb/assets/svg/color/images/TravelPlanning';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {Cloud} from '@atb/assets/svg/color/illustrations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {MobileTokenTabParams} from '@atb/screens/MobileTokenOnboarding/index';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type OnboardingInfoProps = {
  navigation: MaterialTopTabNavigationProp<MobileTokenTabParams>;
};

export function FlexibilityInfoScreen({
  navigation,
}: OnboardingInfoProps): JSX.Element {
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
              {t(MobileTokenOnboardingTexts.flexibilityInfo.heading)}
            </ThemeText>
          </View>
          <View style={styles.illustration}>
            <TravelPlanning />
          </View>
          <ThemeText color={themeColor} style={styles.description}>
            {t(MobileTokenOnboardingTexts.flexibilityInfo.description)}
          </ThemeText>
        </View>
        <View style={styles.buttons}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('OptionsInfoScreen');
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(MobileTokenOnboardingTexts.a11yNextPageHint)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export function OptionsInfoScreen({
  navigation,
}: OnboardingInfoProps): JSX.Element {
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
              navigation.navigate('TicketSafetyInfoScreen');
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(MobileTokenOnboardingTexts.a11yNextPageHint)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export function TicketSafetyInfoScreen({
  navigation,
}: OnboardingInfoProps): JSX.Element {
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
              {t(MobileTokenOnboardingTexts.ticketSafetyInfo.heading)}
            </ThemeText>
          </View>
          <View style={styles.illustration}>
            <Cloud />
          </View>
          <ThemeText
            color={themeColor}
            style={styles.description}
            isMarkdown={true}
          >
            {t(MobileTokenOnboardingTexts.ticketSafetyInfo.description)}
          </ThemeText>
        </View>
        <View style={styles.buttons}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('MobileToken');
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(MobileTokenOnboardingTexts.a11yNextPageHint)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

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
