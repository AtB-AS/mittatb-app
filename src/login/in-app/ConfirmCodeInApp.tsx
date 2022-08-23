import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import ConfirmCode from '@atb/login/ConfirmCode';
import {RootStackParamList} from '@atb/navigation';
import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';
import {shouldOnboardMobileToken} from '@atb/api/utils';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {useAppState} from '@atb/AppContext';

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
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {mobileTokenOnboarded} = useAppState();

  return (
    <ConfirmCode
      phoneNumber={route.params.phoneNumber}
      doAfterLogin={() => {
        const shouldOnboard = shouldOnboardMobileToken(
          hasEnabledMobileToken,
          'phone',
          mobileTokenOnboarded,
        );
        if (shouldOnboard) {
          navigation.navigate('MobileTokenOnboarding');
        } else {
          navigation.navigate(
            route.params.afterLogin.routeName as any,
            route.params.afterLogin.routeParams,
          );
        }
      }}
    />
  );
};
