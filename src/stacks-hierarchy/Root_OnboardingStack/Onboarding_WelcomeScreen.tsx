import {Onboarding1} from '@atb/assets/svg/color/images/';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {OnboardingScreenProps} from './navigation-types';

export const themeColor: StaticColorByType<'background'> =
  'background_accent_0';

export type Props = OnboardingScreenProps<'Onboarding_WelcomeScreen'>;

export const Onboarding_WelcomeScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {width: windowWidth} = useWindowDimensions();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainView}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={styles.header}
          color={themeColor}
          accessibilityLabel={t(OnboardingTexts.welcome.titleA11yLabel)}
        >
          {t(OnboardingTexts.welcome.title)}
        </ThemeText>
        <Onboarding1 width={windowWidth} height={windowWidth * (2 / 3)} />
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            {t(OnboardingTexts.welcome.description.part1)}
          </ThemeText>
        </View>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={() => navigation.navigate('Onboarding_IntercomInfoScreen')}
          text={t(OnboardingTexts.welcome.mainButton)}
          testID="nextButtonOnboardingWelcome"
        />
      </View>
    </ScrollView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
    paddingTop: theme.spacings.xLarge,
  },
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    paddingTop: theme.spacings.xLarge,
  },
  mainView: {
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
}));
