import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {useNavigation} from '@react-navigation/native';
import TravelDocumentOnboardingTexts from '@atb/translations/screens/subscreens/TravelDocumentOnboarding';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import Button from '@atb/components/button';
import TravelPlanning from '@atb/assets/svg/color/images/TravelPlanning';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {Cloud} from '@atb/assets/svg/color/illustrations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

FlexibilityInfo.navigationOptions = {
  gesturesEnabled: false,
  swipeEnabled: false,
};
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
            type="body__primary--jumbo--bold"
            style={styles.header}
            color={themeColor}
          >
            {t(TravelDocumentOnboardingTexts.info1.heading)}
          </ThemeText>
        </View>
        <TravelPlanning style={styles.alignCenter} />
        <ThemeText
          color={themeColor}
          style={[styles.alignCenter, styles.marginTop]}
        >
          {t(TravelDocumentOnboardingTexts.info1.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('OptionsInfo');
            }}
            text={t(TravelDocumentOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(
              TravelDocumentOnboardingTexts.a11yNextPageHint,
            )}
          />
        </FullScreenFooter>
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
            type="body__primary--jumbo--bold"
            style={styles.header}
            color={themeColor}
          >
            {t(TravelDocumentOnboardingTexts.info2.heading)}
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
            {t(TravelDocumentOnboardingTexts.info2.or)}
          </ThemeText>
          <ThemedTokenPhone />
        </View>
        <ThemeText color={themeColor} style={styles.alignCenter}>
          {t(TravelDocumentOnboardingTexts.info2.description)}
        </ThemeText>
      </View>

      <View style={styles.bottomView}>
        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('TicketSafetyInfo');
            }}
            text={t(TravelDocumentOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(
              TravelDocumentOnboardingTexts.a11yNextPageHint,
            )}
          />
        </FullScreenFooter>
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
            type="body__primary--jumbo--bold"
            style={[styles.alignCenter, styles.header]}
            color={themeColor}
          >
            {t(TravelDocumentOnboardingTexts.info3.heading)}
          </ThemeText>
        </View>
        <View style={styles.alignCenter}>
          <Cloud />
        </View>
        <ThemeText
          color={themeColor}
          style={[styles.alignCenter, styles.marginTop]}
          isMarkdown={true}
        >
          {t(TravelDocumentOnboardingTexts.info3.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('TravelDocument');
            }}
            text={t(TravelDocumentOnboardingTexts.next)}
            testID="nextButton"
            accessibilityHint={t(
              TravelDocumentOnboardingTexts.a11yNextPageHint,
            )}
          />
        </FullScreenFooter>
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
  header: {
    marginTop: 55,
    height: 100,
    marginBottom: theme.spacings.xLarge,
    textAlign: 'center',
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
  bottomView: {
    marginTop: 34,
  },
}));
