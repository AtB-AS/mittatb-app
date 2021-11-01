import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import AssignTravelToken from '@atb/login/AssignTravelToken';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type AssignTravelTokenInAppRouteParams = {
  afterLogin: AfterLoginParams;
  selectedDeviceId: number;
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
    params: {afterLogin, selectedDeviceId},
  },
}: AssignTravelTokenInAppProps) => (
  <AssignTravelToken
    doAfterSubmit={() => {
      afterLogin;
    }}
    headerLeftButton={{type: 'back'}}
    selectedDeviceId={selectedDeviceId}
  />
);
