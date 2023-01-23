import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {
  DeparturesStackParams,
  RootDeparturesScreenProps,
} from './navigation-types';
import {Departures_NearbyStopPlacesScreen} from './Departures_NearbyStopPlacesScreen';
import {Departures_OnboardingScreen} from './Departures_OnboardingScreen';
import {Departures_DepartureDetailsScreen} from './Departures_DepartureDetailsScreen';
import {Departures_TravelDetailsMapScreen} from './Departures_TravelDetailsMapScreen';
import {Departures_PlaceScreen} from './Departures_PlaceScreen';

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
      />
      <Stack.Screen
        name="Departures_PlaceScreen"
        component={Departures_PlaceScreen}
      />
      <Stack.Screen
        name="Departures_DepartureDetailsScreen"
        component={Departures_DepartureDetailsScreen}
      />
      <Stack.Screen
        name="Departures_TravelDetailsMapScreen"
        component={Departures_TravelDetailsMapScreen}
      />
      <Stack.Screen
        name="Departures_OnboardingScreen"
        component={Departures_OnboardingScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </Stack.Navigator>
  );
};
