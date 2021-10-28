import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import ConfirmCode from '@atb/login/ConfirmCode';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type ConfirmCodeInAppRouteParams = {
  phoneNumber: string;
  afterLogin: AfterLoginParams;
};

type ConfirmCodeInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'ConfirmCodeInApp'
>;

export const ConfirmCodeInApp = ({
  navigation,
  route: {
    params: {afterLogin, phoneNumber},
  },
}: {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: ConfirmCodeInAppRouteProps;
}) => {
  return (
    <ConfirmCode
      phoneNumber={phoneNumber}
      doAfterLogin={() =>
        navigation.navigate('AssignTravelTokenInApp', {
          afterLogin,
        })
      }
    />
  );
};
