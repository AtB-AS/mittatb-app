import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Dashboard from './Dashboard';
import TripSearch from '@atb/screens/Dashboard/TripSearch';

export type DashboardParams = {
  Dashboard: undefined;
  TripSearch: undefined;
};

const Stack = createStackNavigator<DashboardParams>();

const Assistant = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Dashboard" component={Dashboard}></Stack.Screen>
      <Stack.Screen
        name="TripSearch"
        component={TripSearch}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
export default Assistant;
