import {useAppState} from '@atb/AppContext';
import PhoneInput from '@atb/login/PhoneInput';
import {AfterLoginParams} from '@atb/login/types';
import {useFinishOnboarding} from '@atb/stacks-hierarchy/Root_OnboardingStack/use-finish-onboarding';
import React from 'react';
import {LoginInAppScreenProps} from '../types';

export type PhoneInputInAppRouteParams = {
  afterLogin:
    | AfterLoginParams<'Root_TabNavigatorStack'>
    | AfterLoginParams<'Root_PurchaseOverviewScreen'>;
};

type PhoneInputInAppProps = LoginInAppScreenProps<'PhoneInputInApp'>;

export const PhoneInputInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: PhoneInputInAppProps) => {
  const finishOnboarding = useFinishOnboarding();
  const {onboarded} = useAppState();
  return (
    <PhoneInput
      doAfterLogin={async (phoneNumber: string) => {
        if (!onboarded) {
          await finishOnboarding();
        }
        return navigation.navigate('ConfirmCodeInApp', {
          afterLogin,
          phoneNumber,
        });
      }}
      headerLeftButton={{type: 'back'}}
    />
  );
};
