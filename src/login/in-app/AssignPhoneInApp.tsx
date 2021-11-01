import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import AssignPhone from '@atb/login/AssignPhone';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type AssignPhoneInAppRouteParams = {
  afterLogin: AfterLoginParams;
  currentDeviceId: number;
};

type AssignPhoneInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'AssignPhoneInApp'
>;

export type AssignPhoneInAppProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: AssignPhoneInAppRouteProps;
};

export const AssignPhoneInApp = ({
  navigation,
  route: {
    params: {currentDeviceId},
  },
}: AssignPhoneInAppProps) => (
  <AssignPhone
    currentDeviceId={currentDeviceId}
    headerLeftButton={{type: 'back'}}
  />
);
