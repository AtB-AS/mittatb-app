import PhoneInput from '@atb/login/PhoneInput';
import {OnboardingScreenProps} from '@atb/screens/Onboarding/types';
import React from 'react';

// @TODO Are these files in use??

type PhoneInputOnboardingProps =
  OnboardingScreenProps<'PhoneInputInOnboarding'>;

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
