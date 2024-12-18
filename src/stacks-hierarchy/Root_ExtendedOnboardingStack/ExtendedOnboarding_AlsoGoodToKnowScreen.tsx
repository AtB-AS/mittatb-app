import {Onboarding5} from '@atb/assets/svg/color/images';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ExtendedOnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {useOnboardingNavigation} from '@atb/onboarding';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const ExtendedOnboarding_AlsoGoodToKnowScreen = () => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const interactiveColor = theme.color.interactive[0];
  const styles = useThemeStyles();
  const {width: windowWidth} = useWindowDimensions();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainView}>
        <ThemeText
          typography="body__primary--jumbo--bold"
          color={themeColor}
          style={styles.header}
        >
          {t(ExtendedOnboardingTexts.alsoGoodToKnow.title)}
        </ThemeText>
        <Onboarding5 width={windowWidth} height={windowWidth * (4 / 5)} />
        <ThemeText style={styles.description} color={themeColor}>
          {t(ExtendedOnboardingTexts.alsoGoodToKnow.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor={interactiveColor}
          onPress={() => continueFromOnboardingSection('extendedOnboarding')}
          text={t(ExtendedOnboardingTexts.alsoGoodToKnow.mainButton)}
          testID="nextButtonAlsoGoodToKnowOnboarding"
        />
      </View>
    </ScrollView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
    paddingTop: theme.spacing.xLarge,
  },
  container: {
    backgroundColor: getThemeColor(theme).background,
    paddingTop: theme.spacing.xLarge,
  },
  mainView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
  },
}));
