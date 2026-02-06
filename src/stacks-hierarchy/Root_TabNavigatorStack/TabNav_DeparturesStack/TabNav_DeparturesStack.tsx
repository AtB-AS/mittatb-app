import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  DeparturesStackParams,
  RootDeparturesScreenProps,
} from './navigation-types';
import {Departures_NearbyStopPlacesScreen} from './Departures_NearbyStopPlacesScreen';
import {Departures_DepartureDetailsScreen} from './Departures_DepartureDetailsScreen';
import {Departures_TravelDetailsMapScreen} from './Departures_TravelDetailsMapScreen';
import {Departures_PlaceScreen} from './Departures_PlaceScreen';
import {screenOptions} from '@atb/stacks-hierarchy/navigation-utils';
import {Departures_TravelAidScreen} from './Departures_TravelAidScreen';

const Stack = createStackNavigator<DeparturesStackParams>();

export const TabNav_DeparturesStack = ({}: RootDeparturesScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Departures_NearbyStopPlacesScreen"
      screenOptions={screenOptions(TransitionPresets.SlideFromRightIOS, {
        headerShown: false,
      })}
    >
      <Stack.Screen
        name="Departures_NearbyStopPlacesScreen"
        component={Departures_NearbyStopPlacesScreen}
        initialParams={{}}
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
        name="Departures_TravelAidScreen"
        component={Departures_TravelAidScreen}
      />
    </Stack.Navigator>
  );
};
