import ConfirmCode from '@atb/login/ConfirmCode';
import {AfterLoginParams} from '@atb/login/types';
import {StackActions} from '@react-navigation/native';
import React from 'react';
import {LoginInAppScreenProps} from '../types';

export type ConfirmCodeInAppRouteParams = {
  phoneNumber: string;
  afterLogin: AfterLoginParams;
};

type Props = LoginInAppScreenProps<'ConfirmCodeInApp'>;

export const ConfirmCodeInApp = ({navigation, route}: Props) => {
  return (
    <ConfirmCode
      phoneNumber={route.params.phoneNumber}
      doAfterLogin={() => {
        navigation.dispatch(
          StackActions.replace(route.params.afterLogin.routeName as any, {
            ...route.params.afterLogin.routeParams,
          }),
        );
      }}
    />
  );
};
