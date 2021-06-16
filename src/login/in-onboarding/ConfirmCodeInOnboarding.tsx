import React from 'react';
import ConfirmCode from '@atb/login/ConfirmCode';
import {RouteProp} from '@react-navigation/native';
import {OnboardingStackParams} from '@atb/screens/Onboarding';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';

export type ConfirmCodeInOnboardingRouteParams = {
  phoneNumber: string;
};

type ConfirmCodeInOnboardingRouteProps = RouteProp<
  OnboardingStackParams,
  'ConfirmCodeInOnboarding'
>;

export const ConfirmCodeInOnboarding = ({
  route,
}: {
  route: ConfirmCodeInOnboardingRouteProps;
}) => {
  const finishOnboarding = useFinishOnboarding();
  return (
    <ConfirmCode
      phoneNumber={route.params.phoneNumber}
      doAfterLogin={finishOnboarding}
    />
  );
};
