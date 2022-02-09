import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import SplashInfo from './Info';

export type TicketSplashStackParams = {
  SplashInfo: undefined;
};

export type TicketSplashNavigationProp =
  StackNavigationProp<TicketSplashStackParams>;

const Stack = createStackNavigator<TicketSplashStackParams>();

export default function SplashNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SplashInfo" component={SplashInfo} />
    </Stack.Navigator>
  );
}
