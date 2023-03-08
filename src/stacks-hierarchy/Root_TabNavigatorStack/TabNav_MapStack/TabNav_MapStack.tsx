import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {Map_RootScreen} from './Map_RootScreen';
import {Map_DepartureDetailsScreen} from './Map_DepartureDetailsScreen';
import {Map_QuayDeparturesScreen} from './Map_QuayDeparturesScreen';
import {Map_TravelDetailsMapScreen} from './Map_TravelDetailsMapScreen';
import {Map_PlaceScreen} from './Map_PlaceScreen';
import {Map_ScooterOnboardingScreen} from './Map_ScooterOnboardingScreen';
import {MapStackParams} from './navigation-types';

const Stack = createStackNavigator<MapStackParams>();

export const TabNav_MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Map_RootScreen"
    >
      <Stack.Screen name="Map_RootScreen" component={Map_RootScreen} />
      <Stack.Screen name="Map_PlaceScreen" component={Map_PlaceScreen} />
      <Stack.Screen
        name="Map_DepartureDetailsScreen"
        component={Map_DepartureDetailsScreen}
      />
      <Stack.Screen
        name="Map_TravelDetailsMapScreen"
        component={Map_TravelDetailsMapScreen}
      />
      <Stack.Screen
        name="Map_QuayDeparturesScreen"
        component={Map_QuayDeparturesScreen}
      />
      <Stack.Screen
        name="Map_ScooterOnboardingScreen"
        component={Map_ScooterOnboardingScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </Stack.Navigator>
  );
};
