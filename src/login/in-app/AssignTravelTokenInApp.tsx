import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import AssignTravelToken from '@atb/login/AssignTravelToken';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type AssignTravelTokenInAppRouteParams = {
  afterLogin: AfterLoginParams;
};

type AssignTravelTokenInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'AssignTravelTokenInApp'
>;

export type AssignTravelTokenInAppProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: AssignTravelTokenInAppRouteProps;
};

export const AssignTravelTokenInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: AssignTravelTokenInAppProps) => (
  <AssignTravelToken
    doAfterSubmit={() =>
      navigation.navigate('AssignTravelTokenInApp', {
        afterLogin,
      })
    }
    headerLeftButton={{type: 'back'}}
  />
);
