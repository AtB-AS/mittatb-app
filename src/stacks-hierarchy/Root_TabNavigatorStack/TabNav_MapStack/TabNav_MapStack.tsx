import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Map_RootScreen} from './Map_RootScreen';
import {Map_DepartureDetailsScreen} from './Map_DepartureDetailsScreen';
import {Map_TravelDetailsMapScreen} from './Map_TravelDetailsMapScreen';
import {Map_PlaceScreen} from './Map_PlaceScreen';
import {MapStackParams} from './navigation-types';
import {transitionOptions} from '@atb/stacks-hierarchy/navigation-utils';

const Stack = createStackNavigator<MapStackParams>();

export const TabNav_MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Map_RootScreen"
    >
      <Stack.Screen
        name="Map_RootScreen"
        component={Map_RootScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Map_PlaceScreen"
        component={Map_PlaceScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Map_DepartureDetailsScreen"
        component={Map_DepartureDetailsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Map_TravelDetailsMapScreen"
        component={Map_TravelDetailsMapScreen}
        options={transitionOptions()}
      />
    </Stack.Navigator>
  );
};
