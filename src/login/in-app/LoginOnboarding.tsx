import React from 'react';

import LoginOnboarding from '@atb/login/LoginOnboarding';
import {AfterLoginParams} from '@atb/login/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {LoginInAppScreenProps} from '../types';
import {FareProductTypeConfig} from '@atb/configuration';

export type LoginOnboardingInAppRouteParams = {
  afterLogin:
    | AfterLoginParams<'Root_TabNavigatorStack'>
    | AfterLoginParams<'Root_PurchaseOverviewScreen'>;
  fareProductTypeConfig: FareProductTypeConfig;
};

type LoginOnboardingProps = LoginInAppScreenProps<'LoginOnboardingInApp'>;

export const LoginOnboardingInApp = ({
  navigation,
  route: {
    params: {fareProductTypeConfig, afterLogin},
  },
}: LoginOnboardingProps) => {
  const {enable_vipps_login} = useRemoteConfig();
  return (
    <LoginOnboarding
      fareProductTypeConfig={fareProductTypeConfig}
      doAfterSubmit={(hasActiveFareContracts: boolean) => {
        if (hasActiveFareContracts) {
          navigation.navigate('ActiveFareContractPromptInApp', {
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
