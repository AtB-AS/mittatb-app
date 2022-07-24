import {StyleSheet} from '@atb/theme';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {Onboarding2} from '@atb/assets/svg/color/images';
import {StaticColorByType} from '@atb/theme/colors';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {OnboardingStackParams} from '@atb/screens/Onboarding/index';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type IntercomInfoScreenProps = {
  navigation: MaterialTopTabNavigationProp<OnboardingStackParams>;
};

export default function IntercomInfo({navigation}: IntercomInfoScreenProps) {
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
          {t(OnboardingTexts.intercom.title)}
        </ThemeText>
        <Onboarding2 width={windowWidth} height={windowWidth * (4 / 5)} />
        <ThemeText style={styles.description} color={themeColor}>
          {t(OnboardingTexts.intercom.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_1"
          onPress={() => navigation.navigate('ConsequencesFromOnboarding')}
          text={t(OnboardingTexts.intercom.mainButton)}
          icon={ArrowRight}
          iconPosition="right"
          testID="nextButton"
        />
      </View>
    </ScrollView>
  );
}

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
