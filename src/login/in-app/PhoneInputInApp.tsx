import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import PhoneInput from '@atb/login/PhoneInput';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import {useAppState} from '@atb/AppContext';

export type PhoneInputInAppRouteParams = {
  afterLogin: AfterLoginParams;
};

type PhoneInputInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'PhoneInputInApp'
>;

export type PhoneInputInAppProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: PhoneInputInAppRouteProps;
};

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
