import {Onboarding1} from '@atb/assets/svg/color/images/';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {OnboardingScreenProps} from './types';

export const themeColor: StaticColorByType<'background'> =
  'background_accent_0';

export type WelcomeScreenProps =
  OnboardingScreenProps<'WelcomeScreenWithoutLogin'>;

export const WelcomeScreenWithoutLogin = ({navigation}: WelcomeScreenProps) => {
  const onNext = () => {
    navigation.navigate('IntercomInfo');
  };

  return <WelcomeScreen inLoginContext={false} onNext={onNext} />;
};

const WelcomeScreen = ({
  inLoginContext,
  onNext,
}: {
  inLoginContext: boolean;
  onNext: () => void;
}) => {
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
          {inLoginContext ? (
            <>
              <ThemeText style={styles.description} color={themeColor}>
                {t(OnboardingTexts.welcome.description.part2)}
              </ThemeText>
              <ThemeText style={styles.description} color={themeColor}>
                {t(OnboardingTexts.welcome.description.part3)}
              </ThemeText>
            </>
          ) : null}
        </View>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={onNext}
          text={t(OnboardingTexts.welcome.mainButton)}
          testID="nextButton"
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
