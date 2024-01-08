import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  DeparturesStackParams,
  RootDeparturesScreenProps,
} from './navigation-types';
import {Departures_NearbyStopPlacesScreen} from './Departures_NearbyStopPlacesScreen';
import {Departures_DepartureDetailsScreen} from './Departures_DepartureDetailsScreen';
import {Departures_TravelDetailsMapScreen} from './Departures_TravelDetailsMapScreen';
import {Departures_PlaceScreen} from './Departures_PlaceScreen';
import {transitionOptions} from '@atb/stacks-hierarchy/navigation-utils';

const Stack = createStackNavigator<DeparturesStackParams>();

export const TabNav_DeparturesStack = ({}: RootDeparturesScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Departures_NearbyStopPlacesScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="Departures_NearbyStopPlacesScreen"
        component={Departures_NearbyStopPlacesScreen}
        initialParams={{mode: 'Departure'}}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Departures_PlaceScreen"
        component={Departures_PlaceScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Departures_DepartureDetailsScreen"
        component={Departures_DepartureDetailsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Departures_TravelDetailsMapScreen"
        component={Departures_TravelDetailsMapScreen}
        options={transitionOptions()}
      />
    </Stack.Navigator>
  );
};
