import React from 'react';

import {AfterLoginParams} from '@atb/login/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import ActiveTicketPrompt from '../ActiveTicketPrompt';
import {LoginInAppScreenProps} from '../types';

export type ActiveTicketPromptInAppRouteParams = {
  afterLogin:
    | AfterLoginParams<'TabNavigator'>
    | AfterLoginParams<'TicketPurchase'>;
};

type Props = LoginInAppScreenProps<'ActiveTicketPromptInApp'>;

export const ActiveTicketPromptInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: Props) => {
  const {enable_vipps_login} = useRemoteConfig();
  return (
    <ActiveTicketPrompt
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
