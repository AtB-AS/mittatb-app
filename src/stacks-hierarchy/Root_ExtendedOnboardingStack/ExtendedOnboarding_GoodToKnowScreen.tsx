import {Onboarding4} from '@atb/assets/svg/color/images';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ExtendedOnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {ExtendedOnboardingScreenProps} from './navigation-types';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export type GoodToKnowScreenProps =
  ExtendedOnboardingScreenProps<'ExtendedOnboarding_GoodToKnowScreen'>;

export const ExtendedOnboarding_GoodToKnowScreen = ({
  navigation,
}: GoodToKnowScreenProps) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const interactiveColor = theme.color.interactive[0];
  const styles = useThemeStyles();
  const {width: windowWidth} = useWindowDimensions();

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
          {t(ExtendedOnboardingTexts.goodToKnow.title)}
        </ThemeText>
        <Onboarding4 width={windowWidth} height={windowWidth * (4 / 5)} />
        <ThemeText style={styles.description} color={themeColor}>
          {t(ExtendedOnboardingTexts.goodToKnow.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <Button
          expand={true}
          interactiveColor={interactiveColor}
          onPress={() =>
            navigation.navigate('ExtendedOnboarding_AlsoGoodToKnowScreen')
          }
          text={t(ExtendedOnboardingTexts.goodToKnow.mainButton)}
          testID="nextButtonGoodToKnowOnboarding"
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
