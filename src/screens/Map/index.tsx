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
import QuayDepartures, {
  QuayDeparturesRouteParams,
} from '../TripDetails/QuayDepartures';
import TripDetails from '../TripDetails';
import {DetailsStackParams} from '../TripDetails/types';
import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';

export type MapStackNavigatorParams = {
  MapScreen: undefined;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  DetailsMap: MapDetailRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
};

export type RootMapScreenProps = TabNavigatorScreenProps<'MapScreen'>;

export type MapScreenProps<T extends keyof MapStackNavigatorParams> =
  CompositeScreenProps<
    StackScreenProps<MapStackNavigatorParams, T>,
    RootMapScreenProps
  >;

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
      <Stack.Screen name="QuayDepartures" component={QuayDepartures} />
      <Stack.Screen name="TripDetails" component={TripDetails} />
    </Stack.Navigator>
  );
};

export default MapStack;
