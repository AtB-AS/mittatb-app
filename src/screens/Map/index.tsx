import React from 'react';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {MapScreen} from '@atb/screens/Map/MapScreen';
import PlaceScreen, {
  PlaceScreenParams,
} from '@atb/screens/Departures/PlaceScreen';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '@atb/screens/TripDetails/DepartureDetails';
import {
  MapDetailRouteParams,
  TravelDetailsMap,
} from '@atb/screens/TripDetails/Map';
import {DashboardParams} from '../Dashboard/types';

export type MapStackNavigatorParams = {
  MapScreen: undefined;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  DetailsMap: MapDetailRouteParams;
  Dashboard: DashboardParams;
};

export type MapScreenProps<T extends keyof MapStackNavigatorParams> =
  StackScreenProps<MapStackNavigatorParams, T>;

const Stack = createStackNavigator<MapStackNavigatorParams>();

const MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="MapScreen"
    >
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
      <Stack.Screen name="DetailsMap" component={TravelDetailsMap} />
    </Stack.Navigator>
  );
};

export default MapStack;
