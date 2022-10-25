import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import TripDetailsRoot from '../TripDetails';
import DepartureDetails from '../TripDetails/DepartureDetails';
import TravelDetailsMap from '../TripDetails/Map';
import QuayDepartures from '../TripDetails/QuayDepartures';
import DeparturesRoot from './NearbyPlacesScreen';
import PlaceScreen from './PlaceScreen';
import {DeparturesStackParams, RootDeparturesScreenProps} from './types';
import {DeparturesV2Screen} from '@atb/screens/Departures/DeparturesV2Screen';

const Stack = createStackNavigator<DeparturesStackParams>();

const DeparturesScreen = ({}: RootDeparturesScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName="DeparturesV2Screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="DeparturesV2Screen" component={DeparturesV2Screen} />
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
