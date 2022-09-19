import DashboardRoot from '@atb/screens/Dashboard/Dashboard';
import JourneyDatePicker from '@atb/screens/Dashboard/journey-date-picker';
import TripSearch from '@atb/screens/Dashboard/TripSearch';
import TripDetailsRoot from '@atb/screens/TripDetails';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {DashboardParams} from './types';

const Stack = createStackNavigator<DashboardParams>();

const Dashboard = () => {
  return (
    <Stack.Navigator
      initialRouteName="DashboardRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="DashboardRoot"
        component={DashboardRoot}
      ></Stack.Screen>
      <Stack.Screen
        name="TripSearch"
        component={TripSearch}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="TripDetails"
        component={TripDetailsRoot}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="DateTimePicker"
        component={JourneyDatePicker}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
export default Dashboard;
