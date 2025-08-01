import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {EnrollmentOnboardingScreenProps} from '../../enrollment-onboarding/navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedContact} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useEnrollmentOnboarding} from '@atb/modules/enrollment-onboarding';

export type WelcomeScreenProps =
  EnrollmentOnboardingScreenProps<'BonusOnboarding_WelcomeScreen'>;

export const BonusOnboarding_WelcomeScreen = ({}: WelcomeScreenProps) => {
  const {t} = useTranslation();

  const {navigateToNextScreen} = useEnrollmentOnboarding(
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
