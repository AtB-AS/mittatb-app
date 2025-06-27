import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  BonusOnboardingNavigationProps,
  BonusOnboardingScreenProps,
} from './navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedContact} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigation} from '@react-navigation/native';

export type WelcomeScreenProps =
  BonusOnboardingScreenProps<'BonusOnboarding_WelcomeScreen'>;

export const BonusOnboarding_WelcomeScreen = ({}: WelcomeScreenProps) => {
  const navigation = useNavigation<BonusOnboardingNavigationProps>();
  const {t} = useTranslation();

  return (
    <OnboardingScreenComponent
      illustration={<ThemedContact height={170} />}
      title={t(BonusProgramTexts.onBoarding.welcome.title)}
      description={t(BonusProgramTexts.onBoarding.welcome.description)}
      buttonText={t(BonusProgramTexts.onBoarding.welcome.buttonText)}
      buttonOnPress={() =>
        navigation.navigate('BonusOnboarding_BuyTicketsScreen')
      }
      buttonRightIcon={{svg: ArrowRight}}
      testID="welcomeBonusOnboarding"
    />
  );
};
