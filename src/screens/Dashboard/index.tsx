import DashboardRoot from '@atb/screens/Dashboard/Dashboard';
import JourneyDatePicker from '@atb/screens/Dashboard/journey-date-picker';
import TripSearch from '@atb/screens/Dashboard/TripSearch';
import TripDetailsRoot from '@atb/screens/TripDetails';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {DashboardParams} from './types';
import NearbyStopPlacesScreen from '@atb/screens/Dashboard/NearbyStopPlacesScreen';
import FavoriteDepartures from '@atb/screens/Profile/FavoriteDepartures';
import PlaceScreen from '@atb/screens/Departures/PlaceScreen';

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
      <Stack.Screen
        name="NearbyStopPlacesScreen"
        component={NearbyStopPlacesScreen}
      ></Stack.Screen>
      <Stack.Screen name="PlaceScreen" component={PlaceScreen}></Stack.Screen>
      <Stack.Screen name="FavoriteDepartures" component={FavoriteDepartures} />
    </Stack.Navigator>
  );
};
export default Dashboard;
