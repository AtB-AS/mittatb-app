import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';

import {RouteProp} from '@react-navigation/native';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';
import ActiveTicketPrompt from '../ActiveTicketPrompt';

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
}: ActiveTicketPromptProps) => (
  <ActiveTicketPrompt
    doAfterSubmit={() => {
      navigation.navigate('PhoneInputInApp', {
        afterLogin,
      });
    }}
    headerLeftButton={{type: 'cancel'}}
  />
);
