import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Ticketing_NotEnabledScreen} from './Ticketing_NotEnabledScreen';
import {Ticketing_RootScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_RootScreen';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {NavigatorScreenParams} from '@react-navigation/native';
import {
  TicketTabNavStackParams,
  TicketingTicketHistoryScreenParams,
} from './Ticketing_TicketTabNavStack/navigation-types';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {Ticketing_TicketHistoryScreen} from './Ticketing_TicketHistoryScreen';

export type TicketingStackParams = StackParams<{
  Ticketing_NotEnabledScreen: undefined;
  Ticketing_RootScreen: NavigatorScreenParams<TicketTabNavStackParams>;
  Ticketing_TicketHistoryScreen: TicketingTicketHistoryScreenParams;
}>;

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
      <Stack.Screen
        name="Ticketing_TicketHistoryScreen"
        component={Ticketing_TicketHistoryScreen}
      />
    </Stack.Navigator>
  );
};
