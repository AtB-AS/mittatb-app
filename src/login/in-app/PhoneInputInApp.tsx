import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import PhoneInput from '@atb/login/PhoneInput';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type PhoneInputInAppRouteParams = {
  /**
   * An optional message to the user why the login is necessary
   */
  loginReason?: string;
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
    params: {loginReason, afterLogin},
  },
}: PhoneInputInAppProps) => (
  <PhoneInput
    loginReason={loginReason}
    doAfterLogin={(phoneNumber: string) =>
      navigation.navigate('ConfirmCodeInApp', {
        afterLogin,
        phoneNumber,
      })
    }
    headerLeftButton={{type: 'cancel'}}
  />
);
