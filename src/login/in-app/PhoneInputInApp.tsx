import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import PhoneInput from '@atb/login/PhoneInput';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

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
}: PhoneInputInAppProps) => (
  <PhoneInput
    doAfterLogin={(phoneNumber: string) =>
      navigation.navigate('ConfirmCodeInApp', {
        afterLogin,
        phoneNumber,
      })
    }
    headerLeftButton={{type: 'back'}}
  />
);
