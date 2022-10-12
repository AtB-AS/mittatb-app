import React from 'react';

import {AfterLoginParams} from '@atb/login/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import ActiveFareContractPrompt from '../ActiveFareContractPrompt';
import {LoginInAppScreenProps} from '../types';

export type activeFareContractPromptInAppRouteParams = {
  afterLogin:
    | AfterLoginParams<'TabNavigator'>
    | AfterLoginParams<'TicketPurchase'>;
};

type Props = LoginInAppScreenProps<'activeFareContractPromptInApp'>;

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
