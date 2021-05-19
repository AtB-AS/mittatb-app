import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParams} from '@atb/screens/Onboarding/index';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';

export type WelcomeScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParams>;
};

export default function WelcomeScreen({navigation}: WelcomeScreenProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  return (
    <View style={styles.container}>
      <FullScreenHeader setFocusOnLoad={false} />

      <ScrollView style={styles.mainView}>
        <View ref={focusRef} accessibilityRole="header" accessible={true}>
          <ThemeText type={'body__primary--jumbo--bold'}>
            {t(OnboardingTexts.welcome.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.descriptionPart}>
            {t(OnboardingTexts.welcome.description.part1)}
          </ThemeText>
          <ThemeText style={styles.descriptionPart}>
            {t(OnboardingTexts.welcome.description.part2)}
          </ThemeText>
          <ThemeText style={styles.descriptionPart}>
            {t(OnboardingTexts.welcome.description.part3)}
          </ThemeText>
        </View>
      </ScrollView>
      <FullScreenFooter>
        <Button
          color={'primary_3'}
          onPress={() => navigation.navigate('PhoneInputInOnboarding')}
          text={t(OnboardingTexts.welcome.mainButton)}
          icon={ArrowRight}
          iconPosition="right"
        />
      </FullScreenFooter>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
    flex: 1,
  },
  mainView: {
    margin: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
    flex: 1,
  },
  descriptionPart: {marginTop: theme.spacings.medium},
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  resendButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
