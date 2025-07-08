import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {EnrollmentOnboardingScreenProps} from '../../enrollment-onboarding/navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedContact} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigateToNextEnrollmentOnboardingScreen} from '../../enrollment-onboarding/use-navigate-to-next-onboarding-screen';
import {bonusPilotEnrollmentId} from './config';

export type WelcomeScreenProps =
  EnrollmentOnboardingScreenProps<'BonusOnboarding_WelcomeScreen'>;

export const BonusOnboarding_WelcomeScreen = ({}: WelcomeScreenProps) => {
  const {t} = useTranslation();

  const navigateToNext = useNavigateToNextEnrollmentOnboardingScreen(
    bonusPilotEnrollmentId,
    BonusOnboarding_WelcomeScreen.name,
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedContact height={170} />}
      title={t(BonusProgramTexts.onboarding.welcome.title)}
      description={t(BonusProgramTexts.onboarding.welcome.description)}
      footerButton={{
        onPress: navigateToNext,
        text: t(BonusProgramTexts.onboarding.welcome.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="welcomeBonusOnboarding"
    />
  );
};
