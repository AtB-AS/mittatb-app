import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';

import LoginOnboarding from '@atb/login/LoginOnboarding';
// import LoginOnboarding from '@atb/login/LoginOnboarding';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type LoginOnboardingInAppRouteParams = {
  /**
   * An optional message to the user why the login is necessary
   */
  loginReason?: string;
  afterLogin: AfterLoginParams;
};

type LoginOnboardingInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'PhoneInputInApp'
>;

export type LoginOnboardingProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: LoginOnboardingInAppRouteProps;
};

export const LoginOnboardingInApp = ({
  navigation,
  route: {
    params: {loginReason, afterLogin},
  },
}: LoginOnboardingProps) => (
  <LoginOnboarding
    loginReason={loginReason}
    doAfterSubmit={() =>
      navigation.navigate('PhoneInputInApp', {
        afterLogin,
      })
    }
    headerLeftButton={{type: 'cancel'}}
  />
);
