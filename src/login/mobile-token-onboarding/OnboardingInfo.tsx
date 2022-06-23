import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {useNavigation} from '@react-navigation/native';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Button from '@atb/components/button';
import TravelPlanning from '@atb/assets/svg/color/images/TravelPlanning';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {Cloud} from '@atb/assets/svg/color/illustrations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function FlexibilityInfo(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const focusRef = useFocusOnLoad();

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View accessible={true} ref={focusRef}>
          <ThemeText
            type="heading--jumbo"
            style={[styles.alignCenter, styles.header]}
            color={themeColor}
          >
            {t(MobileTokenOnboardingTexts.flexibilityInfo.heading)}
          </ThemeText>
        </View>
        <TravelPlanning style={styles.alignCenter} />
        <ThemeText
          color={themeColor}
          style={[styles.alignCenter, styles.description]}
        >
          {t(MobileTokenOnboardingTexts.flexibilityInfo.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('OptionsInfo');
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(MobileTokenOnboardingTexts.a11yNextPageHint)}
          />
      </View>
    </View>
  );
}

export function OptionsInfo(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const focusRef = useFocusOnLoad();

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View accessible={true} ref={focusRef}>
          <ThemeText
            type="heading--jumbo"
            style={[styles.alignCenter, styles.header]}
            color={themeColor}
          >
            {t(MobileTokenOnboardingTexts.optionsInfo.heading)}
          </ThemeText>
        </View>

        <View style={styles.illustration}>
          <ThemedTokenTravelCard />
          <ThemeText
            color={themeColor}
            style={styles.marginTop}
            accessible={false}
            importantForAccessibility="no"
          >
            {t(MobileTokenOnboardingTexts.optionsInfo.or)}
          </ThemeText>
          <ThemedTokenPhone />
        </View>
        <ThemeText color={themeColor} style={styles.alignCenter}>
          {t(MobileTokenOnboardingTexts.optionsInfo.description)}
        </ThemeText>
      </View>

      <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('TicketSafetyInfo');
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(MobileTokenOnboardingTexts.a11yNextPageHint)}
          />
      </View>
    </View>
  );
}

export function TicketSafetyInfo(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const focusRef = useFocusOnLoad();
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View accessible={true} ref={focusRef}>
          <ThemeText
            type="heading--jumbo"
            style={[styles.alignCenter, styles.header, styles.paddingLarge]}
            color={themeColor}
          >
            {t(MobileTokenOnboardingTexts.ticketSafetyInfo.heading)}
          </ThemeText>
        </View>
        <View style={styles.alignCenter}>
          <Cloud />
        </View>
        <ThemeText
          color={themeColor}
          style={[styles.alignCenter, styles.description]}
          isMarkdown={true}
        >
          {t(MobileTokenOnboardingTexts.ticketSafetyInfo.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
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
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
    paddingHorizontal: theme.spacings.xLarge,
    paddingTop: 92.5,
  },
  mainView: {
    height: 503,
  },
  paddingLarge: {
     padding: theme.spacings.medium
  },
  header: {
    marginTop: 55,
    height: 100,
    width: 327,
    marginBottom: theme.spacings.xLarge,
  },
  alignCenter: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  illustration: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 185,
    paddingTop: 53.5,
    marginBottom: theme.spacings.xLarge,
  },
  marginTop: {
    marginTop: theme.spacings.xLarge,
  },
  description: {
    width: 327,
    marginTop: theme.spacings.xLarge,
  },
  bottomView: {
    marginTop: 34,
  },
}));
