import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import TripSearch from '@atb/screens/Dashboard/TripSearch';
import {TripDetailsRoot} from '../TripDetails';
import {SearchTime} from '../Nearby/types';
import {Location} from '@atb/favorites/types';
import {DetailsRouteParams} from '../TripDetails/Details';
import {DateTimePickerParams} from '../Assistant/journey-date-picker';
import DashboardRoot from './Dashboard';

export type DashboardParams = {
  DashboardRoot: {
    fromLocation: Location | undefined;
    toLocation: Location | undefined;
    searchTime: SearchTime | undefined;
  };
  TripSearch: {
    fromLocation: Location;
    toLocation: Location;
  };
  //TripSearch: DetailsRouteParams;
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
    </Stack.Navigator>
  );
};
export default Dashboard;
