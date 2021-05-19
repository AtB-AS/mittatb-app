import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import ConfirmCode from '@atb/login/ConfirmCode';
import {RootStackParamList} from '@atb/navigation';
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
  route,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
  route: ConfirmCodeInAppRouteProps;
}) => {
  return (
    <ConfirmCode
      phoneNumber={route.params.phoneNumber}
      doAfterLogin={() =>
        navigation.navigate(
          route.params.afterLogin.routeName as any,
          route.params.afterLogin.routeParams,
        )
      }
    />
  );
};
