import React from 'react';

import {AfterLoginParams} from '@atb/login/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import ActiveFareContractPrompt from '../ActiveFareContractPrompt';
import {LoginInAppScreenProps} from '../types';

export type ActiveFareContractPromptInAppRouteParams = {
  afterLogin:
    | AfterLoginParams<'Root_TabNavigatorStack'>
    | AfterLoginParams<'Root_PurchaseOverviewScreen'>;
};

type Props = LoginInAppScreenProps<'ActiveFareContractPromptInApp'>;

export const ActiveFareContractPromptInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: Props) => {
  const {enable_vipps_login} = useRemoteConfig();
  return (
    <ActiveFareContractPrompt
      doAfterSubmit={() => {
        navigation.navigate(
          enable_vipps_login ? 'LoginOptionsScreen' : 'PhoneInputInApp',
          {
            afterLogin,
          },
        );
      }}
      headerLeftButton={{type: 'back'}}
    />
  );
};
