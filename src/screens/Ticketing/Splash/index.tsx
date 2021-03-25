import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import SplashInfo from './Info';
import Enrollment from '@atb/screens/Profile/Enrollment';

export type TicketSplashStackParams = {
  SplashInfo: undefined;
  TicketEnrollment: undefined;
};

export type TicketSplashNavigationProp = StackNavigationProp<TicketSplashStackParams>;

const Stack = createStackNavigator<TicketSplashStackParams>();

export default function SplashNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SplashInfo" component={SplashInfo} />
      <Stack.Screen
        name="TicketEnrollment"
        component={Enrollment}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}
