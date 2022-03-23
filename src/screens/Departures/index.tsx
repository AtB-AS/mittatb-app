import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import DeparturesRoot, {
  NearbyPlacesParams,
  DeparturesProps,
} from './NearbyPlaces';
import PlaceScreen, {PlaceScreenParams} from './PlaceScreen';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../TripDetails_v2/DepartureDetails';
import QuayDepartures, {
  QuayDeparturesRouteParams,
} from '../TripDetails_v2/QuayDepartures';
import TripDetailsRoot, {DetailsStackParams} from '../TripDetails_v2';
import TravelDetailsMap, {MapDetailRouteParams} from '../TripDetails_v2/Map';

export type DeparturesStackParams = {
  DeparturesRoot: NearbyPlacesParams;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
  DetailsMap: MapDetailRouteParams;
};

const Stack = createStackNavigator<DeparturesStackParams>();

type DeparturesRootProps = {
  route: DeparturesProps;
};

const DeparturesScreen = ({route}: DeparturesRootProps) => {
  return (
    <Stack.Navigator
      initialRouteName="DeparturesRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="DeparturesRoot"
        component={DeparturesRoot}
        initialParams={route.params}
      />
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
