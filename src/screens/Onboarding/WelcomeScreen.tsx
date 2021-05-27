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
import {Onboarding1} from '@atb/assets/svg/illustrations';
import Illustration from '@atb/screens/Onboarding/components/Illustration';

export type WelcomeScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParams>;
};

export const WelcomeScreenLogin = ({navigation}: WelcomeScreenProps) => {
  const onNext = () => {
    navigation.navigate('PhoneInputInOnboarding');
  };

  return <WelcomeScreen inLoginContext={true} onNext={onNext} />;
};

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
  const focusRef = useFocusOnLoad();

  return (
    <View style={styles.container}>
      <FullScreenHeader setFocusOnLoad={false} style={styles.header} />
      <Illustration Svg={Onboarding1} />
      <ScrollView style={styles.mainView}>
        <View ref={focusRef} accessibilityRole="header" accessible={true}>
          <ThemeText type={'body__primary--jumbo--bold'} style={styles.title}>
            {t(OnboardingTexts.welcome.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.descriptionPart}>
            {t(OnboardingTexts.welcome.description.part1)}
          </ThemeText>
          {inLoginContext ? (
            <>
              <ThemeText style={styles.descriptionPart}>
                {t(OnboardingTexts.welcome.description.part2)}
              </ThemeText>
              <ThemeText style={styles.descriptionPart}>
                {t(OnboardingTexts.welcome.description.part3)}
              </ThemeText>
            </>
          ) : null}
        </View>
      </ScrollView>
      <FullScreenFooter>
        <Button
          color={'secondary_1'}
          onPress={onNext}
          text={t(OnboardingTexts.welcome.mainButton)}
          icon={ArrowRight}
          iconPosition="right"
        />
      </FullScreenFooter>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.primary_3.backgroundColor,
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.primary_3.backgroundColor,
  },
  mainView: {
    margin: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
    flex: 1,
  },
  title: {
    color: theme.colors.primary_3.color,
  },
  descriptionPart: {
    marginTop: theme.spacings.medium,
    color: theme.colors.primary_3.color,
  },
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
