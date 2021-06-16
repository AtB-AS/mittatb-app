import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import PhoneInput from '@atb/login/PhoneInput';
import {RouteProp} from '@react-navigation/native';
import {OnboardingStackParams} from '@atb/screens/Onboarding';

type PhoneInputOnboardingRouteProps = RouteProp<
  OnboardingStackParams,
  'PhoneInputInOnboarding'
>;

export type PhoneInputOnboardingProps = {
  navigation: StackNavigationProp<OnboardingStackParams>;
  route: PhoneInputOnboardingRouteProps;
};

export const PhoneInputInOnboarding = ({
  navigation,
}: PhoneInputOnboardingProps) => (
  <PhoneInput
    doAfterLogin={(phoneNumber: string) =>
      navigation.navigate('ConfirmCodeInOnboarding', {
        phoneNumber,
      })
    }
    headerRightButton={{
      type: 'skip',
      onPress: () => navigation.navigate('SkipLoginWarning'),
    }}
  />
);
