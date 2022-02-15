import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import MobileTokenOnboarding from '@atb/login/MobileTokenOnboarding';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type MobileTokenOnboardingInAppRouteParams = {
  afterLogin: AfterLoginParams;
  selectedDeviceId: number;
};

type MobileTokenOnboardingInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'MobileTokenOnboardingInApp'
>;

export type MobileTokenOnboardingInAppProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: MobileTokenOnboardingInAppRouteProps;
};

export const MobileTokenOnboardingInApp = ({
  navigation,
  route: {
    params: {afterLogin, selectedDeviceId},
  },
}: MobileTokenOnboardingInAppProps) => {
  const doAfterSubmit = () => {
    navigation.navigate(afterLogin.routeName as any, afterLogin.routeParams);
  };

  return (
    <MobileTokenOnboarding
      doAfterSubmit={doAfterSubmit}
      headerLeftButton={{
        type: 'close',
        onPress: doAfterSubmit,
      }}
      selectedDeviceId={selectedDeviceId}
    />
  );
};
