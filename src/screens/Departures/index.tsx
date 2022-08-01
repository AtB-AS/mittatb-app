import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import DeparturesRoot from './NearbyPlacesScreen';
import PlaceScreen, {PlaceScreenParams} from './PlaceScreen';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../TripDetails/DepartureDetails';
import QuayDepartures, {
  QuayDeparturesRouteParams,
} from '../TripDetails/QuayDepartures';
import TripDetailsRoot, {DetailsStackParams} from '../TripDetails';
import TravelDetailsMap, {MapDetailRouteParams} from '../TripDetails/Map';
import {AllStopsOverviewParams} from '@atb/screens/Departures/AllStopsOverview';

export type DeparturesStackParams = {
  DeparturesRoot: undefined;
  AllStopsOverview: AllStopsOverviewParams;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
  DetailsMap: MapDetailRouteParams;
};

const Stack = createStackNavigator<DeparturesStackParams>();

const DeparturesScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="DeparturesRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="DeparturesRoot" component={DeparturesRoot} />
      <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
      <Stack.Screen name="QuayDepartures" component={QuayDepartures} />
      <Stack.Screen name="TripDetails" component={TripDetailsRoot} />
      <Stack.Screen
        name="DetailsMap"
        component={TravelDetailsMap}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};
export default DeparturesScreen;
