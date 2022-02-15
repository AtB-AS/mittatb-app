import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import TravelTokenOnboarding from '@atb/login/TravelTokenOnboarding';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';

export type TravelTokenOnboardingInAppRouteParams = {
  afterLogin: AfterLoginParams;
  selectedDeviceId: number;
};

type TravelTokenOnboardingInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'TravelTokenOnboardingInApp'
>;

export type TravelTokenOnboardingInAppProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: TravelTokenOnboardingInAppRouteProps;
};

export const TravelTokenOnboardingInApp = ({
  navigation,
  route: {
    params: {afterLogin, selectedDeviceId},
  },
}: TravelTokenOnboardingInAppProps) => {
  const doAfterSubmit = () => {
    navigation.navigate(afterLogin.routeName as any, afterLogin.routeParams);
  };

  return (
    <TravelTokenOnboarding
      doAfterSubmit={doAfterSubmit}
      headerLeftButton={{
        type: 'close',
        onPress: doAfterSubmit,
      }}
      selectedDeviceId={selectedDeviceId}
    />
  );
};
