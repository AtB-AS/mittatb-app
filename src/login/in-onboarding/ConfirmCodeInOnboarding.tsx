import ConfirmCode from '@atb/login/ConfirmCode';
import {OnboardingScreenProps} from '@atb/screens/Onboarding/types';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import React from 'react';

// @TODO Are these files in use??

export type ConfirmCodeInOnboardingRouteParams = {
  phoneNumber: string;
};

type ConfirmCodeInOnboardingRouteProps =
  OnboardingScreenProps<'ConfirmCodeInOnboarding'>;

export const ConfirmCodeInOnboarding = ({
  route,
}: ConfirmCodeInOnboardingRouteProps) => {
  const finishOnboarding = useFinishOnboarding();
  return (
    <ConfirmCode
      phoneNumber={route.params.phoneNumber}
      doAfterLogin={finishOnboarding}
    />
  );
};
