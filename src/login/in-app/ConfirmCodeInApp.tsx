import {ConfirmCode} from '@atb/login/ConfirmCode';
import {AfterLoginParams} from '@atb/login/types';
import {StackActions} from '@react-navigation/native';
import React from 'react';
import {LoginInAppScreenProps} from '../types';

export type ConfirmCodeInAppRouteParams = {
  phoneNumber: string;
  afterLogin:
    | AfterLoginParams<'Root_TabNavigatorStack'>
    | AfterLoginParams<'Root_PurchaseOverviewScreen'>
    | AfterLoginParams<'Root_PurchaseConfirmationScreen'>;
};

type Props = LoginInAppScreenProps<'ConfirmCodeInApp'>;

export const ConfirmCodeInApp = ({navigation, route}: Props) => {
  return (
    <ConfirmCode
      phoneNumber={route.params.phoneNumber}
      doAfterLogin={() => {
        navigation.dispatch(
          StackActions.replace(
            route.params.afterLogin.screen,
            route.params.afterLogin.params,
          ),
        );
      }}
    />
  );
};
