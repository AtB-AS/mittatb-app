import {Onboarding4} from '@atb/assets/svg/color/images';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {OnboardingScreenProps} from './navigation-types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type GoodToKnowScreenProps =
  OnboardingScreenProps<'Onboarding_GoodToKnowScreen'>;

export const Onboarding_GoodToKnowScreen = ({
  navigation,
}: GoodToKnowScreenProps) => {
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
          color={themeColor}
          style={styles.header}
        >
          {t(OnboardingTexts.goodToKnow.title)}
        </ThemeText>
        <Onboarding4 width={windowWidth} height={windowWidth * (4 / 5)} />
        <ThemeText style={styles.description} color={themeColor}>
          {t(OnboardingTexts.goodToKnow.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={() => navigation.navigate('Onboarding_AlsoGoodToKnowScreen')}
          text={t(OnboardingTexts.goodToKnow.mainButton)}
          testID="nextButtonGoodToKnowOnboarding"
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
    flex: 1,
    justifyContent: 'space-between',
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
