import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {LocationWithMetadata} from '../../favorites/types';
import {DetailsRouteParams} from '../TripDetails/Details';
import TripDetailsRoot from '../TripDetails';
import AssistantRoot from './Assistant';

export type AssistantParams = {
  AssistantRoot: {
    fromLocation: LocationWithMetadata;
    toLocation: LocationWithMetadata;
  };
  TripDetails: DetailsRouteParams;
};

const Stack = createStackNavigator<AssistantParams>();

const Assistant = () => {
  return (
    <Stack.Navigator
      initialRouteName="AssistantRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="AssistantRoot"
        component={AssistantRoot}
      ></Stack.Screen>
      <Stack.Screen
        name="TripDetails"
        component={TripDetailsRoot}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
export default Assistant;
