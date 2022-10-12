import React from 'react';

import LoginOnboarding from '@atb/login/LoginOnboarding';
import {AfterLoginParams} from '@atb/login/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {LoginInAppScreenProps} from '../types';

export type LoginOnboardingInAppRouteParams = {
  afterLogin:
    | AfterLoginParams<'TabNavigator'>
    | AfterLoginParams<'TicketPurchase'>;
};

type LoginOnboardingProps = LoginInAppScreenProps<'LoginOnboardingInApp'>;

export const LoginOnboardingInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: LoginOnboardingProps) => {
  const {enable_vipps_login} = useRemoteConfig();
  return (
    <LoginOnboarding
      doAfterSubmit={(hasActiveFareContracts: boolean) => {
        if (hasActiveFareContracts) {
          navigation.navigate('activeFareContractPromptInApp', {
            afterLogin,
          });
        } else {
          navigation.navigate(
            enable_vipps_login ? 'LoginOptionsScreen' : 'PhoneInputInApp',
            {
              afterLogin,
            },
          );
        }
      }}
      headerLeftButton={{type: 'cancel'}}
    />
  );
};
