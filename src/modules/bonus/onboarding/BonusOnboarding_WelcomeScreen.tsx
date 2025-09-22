import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {OnboardingCarouselScreenProps} from '../../onboarding-carousel/navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedContact} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigateToNextOnboardingCarouselScreen} from '@atb/modules/onboarding-carousel';
import {bonusPilotEnrollmentId} from './config';

export type WelcomeScreenProps =
  OnboardingCarouselScreenProps<'BonusOnboarding_WelcomeScreen'>;

export const BonusOnboarding_WelcomeScreen = ({}: WelcomeScreenProps) => {
  const {t} = useTranslation();

  const navigateToNextScreen = useNavigateToNextOnboardingCarouselScreen(
    bonusPilotEnrollmentId,
    'BonusOnboarding_WelcomeScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedContact height={170} />}
      title={t(BonusProgramTexts.onboarding.welcome.title)}
      description={t(BonusProgramTexts.onboarding.welcome.description)}
      footerButton={{
        onPress: navigateToNextScreen,
        text: t(BonusProgramTexts.onboarding.welcome.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="welcomeBonusOnboarding"
    />
  );
};
