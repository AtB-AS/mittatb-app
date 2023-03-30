import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Ticketing_NotEnabledScreen} from './Ticketing_NotEnabledScreen';
import {Ticketing_RootScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_RootScreen';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {NavigatorScreenParams} from '@react-navigation/native';
import {TicketTabNavStackParams} from './Ticketing_TicketTabNavStack/navigation-types';

export type TicketingStackParams = {
  Ticketing_NotEnabledScreen: undefined;
  Ticketing_RootScreen: NavigatorScreenParams<TicketTabNavStackParams>;
};

const Stack = createStackNavigator<TicketingStackParams>();

export const TabNav_TicketingStack = () => {
  const {enable_ticketing} = useRemoteConfig();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!enable_ticketing && (
        <Stack.Screen
          name="Ticketing_NotEnabledScreen"
          component={Ticketing_NotEnabledScreen}
        />
      )}
      {enable_ticketing && (
        <Stack.Screen
          name="Ticketing_RootScreen"
          component={Ticketing_RootScreen}
        />
      )}
    </Stack.Navigator>
  );
};
