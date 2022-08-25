import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';

import LoginOnboarding from '@atb/login/LoginOnboarding';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type LoginOnboardingInAppRouteParams = {
  afterLogin: AfterLoginParams;
};

type LoginOnboardingInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'LoginOnboardingInApp'
>;

export type LoginOnboardingProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: LoginOnboardingInAppRouteProps;
};

export const LoginOnboardingInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: LoginOnboardingProps) => (
  <LoginOnboarding
    doAfterSubmit={(hasActiveFareContracts: boolean) => {
      if (hasActiveFareContracts) {
        navigation.navigate('ActiveTicketPromptInApp', {
          afterLogin,
        });
      } else {
        navigation.navigate('PhoneInputInApp', {
          afterLogin,
        });
      }
    }}
    headerLeftButton={{type: 'cancel'}}
  />
);
