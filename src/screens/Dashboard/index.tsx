import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import TripSearch from '@atb/screens/Dashboard/TripSearch';
import {TripDetailsRoot} from '@atb/screens/TripDetails';
import {SearchTime} from '@atb/screens/Nearby/types';
import {Location} from '@atb/favorites/types';
import {DetailsRouteParams} from '@atb/screens/TripDetails/Details';
import JourneyDatePicker, {
  DateTimePickerParams,
} from '@atb/screens/Dashboard/journey-date-picker';
import DashboardRoot from '@atb/screens/Dashboard/Dashboard';

export type DashboardParams = {
  DashboardRoot: {
    fromLocation: Location | undefined;
    toLocation: Location | undefined;
    searchTime: SearchTime | undefined;
  };
  TripSearch: {
    fromLocation: Location;
    toLocation: Location;
    searchTime: SearchTime | undefined;
  };

  TripDetails: DetailsRouteParams;
  DateTimePicker: DateTimePickerParams;
};

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
