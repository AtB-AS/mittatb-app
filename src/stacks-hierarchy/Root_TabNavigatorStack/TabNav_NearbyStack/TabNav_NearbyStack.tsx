import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Nearby_RootScreen} from './Nearby_Root';
import {NearbyStackParams, RootNearbyScreenProps} from './navigation-types';
import {Nearby_DepartureDetailsScreen} from './Nearby_DepartureDetailsScreen';
import {Nearby_QuayDeparturesScreen} from './Nearby_QuayDeparturesScreen';
import {Nearby_TravelDetailsMapScreen} from './Nearby_TravelDetailsMapScreen';

const Stack = createStackNavigator<NearbyStackParams>();

export const TabNav_NearbyStack = ({}: RootNearbyScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Nearby_RootScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Nearby_RootScreen" component={Nearby_RootScreen} />
      <Stack.Screen
        name="Nearby_DepartureDetailsScreen"
        component={Nearby_DepartureDetailsScreen}
      />
      <Stack.Screen
        name="Nearby_TravelDetailsMapScreen"
        component={Nearby_TravelDetailsMapScreen}
      />
      <Stack.Screen
        name="Nearby_QuayDeparturesScreen"
        component={Nearby_QuayDeparturesScreen}
      />
    </Stack.Navigator>
  );
};
