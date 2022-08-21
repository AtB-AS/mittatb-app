import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';

import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';
import ActiveTicketPrompt from '../ActiveTicketPrompt';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export type ActiveTicketPromptInAppRouteParams = {
  afterLogin: AfterLoginParams;
};

type ActiveTicketPromptInAppRouteProps = RouteProp<
  LoginInAppStackParams,
  'ActiveTicketPromptInApp'
>;

export type ActiveTicketPromptProps = {
  navigation: StackNavigationProp<LoginInAppStackParams>;
  route: ActiveTicketPromptInAppRouteProps;
};

export const ActiveTicketPromptInApp = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: ActiveTicketPromptProps) => {
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
