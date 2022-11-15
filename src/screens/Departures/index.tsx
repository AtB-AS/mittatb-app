import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import TripDetailsRoot from '../TripDetails';
import DepartureDetails from '../TripDetails/DepartureDetails';
import TravelDetailsMap from '../TripDetails/Map';
import QuayDepartures from '../TripDetails/QuayDepartures';
import PlaceScreen from './PlaceScreen';
import {DeparturesStackParams, RootDeparturesScreenProps} from './types';
import {DeparturesScreen} from '@atb/screens/Departures/DeparturesScreen';

const Stack = createStackNavigator<DeparturesStackParams>();

const DeparturesStack = ({}: RootDeparturesScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName="DeparturesScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="DeparturesScreen" component={DeparturesScreen} />
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
export default DeparturesStack;
