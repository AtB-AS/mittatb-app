import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Ticketing_NotEnabledScreen} from './Ticketing_NotEnabledScreen';
import {Ticketing_RootScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_RootScreen';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {Ticketing_TicketHistoryScreen} from './Ticketing_TicketHistoryScreen';
import {TicketingStackParams} from './navigation-types';

const Stack = createStackNavigator<TicketingStackParams>();

export const TabNav_TicketingStack = () => {
  const {enable_ticketing} = useRemoteConfigContext();
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
