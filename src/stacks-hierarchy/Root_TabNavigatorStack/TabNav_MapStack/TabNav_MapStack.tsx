import React from 'react';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {Map_RootScreen} from './Map_RootScreen';
import {Map_DepartureDetailsScreen} from './Map_DepartureDetailsScreen';
import {Map_TravelAidScreen} from './Map_TravelAidScreen';
import {Map_TravelDetailsMapScreen} from './Map_TravelDetailsMapScreen';
import {Map_PlaceScreen} from './Map_PlaceScreen';
import {MapStackParams} from './navigation-types';
import {screenOptions} from '@atb/stacks-hierarchy/navigation-utils';

const Stack = createStackNavigator<MapStackParams>();

export const TabNav_MapStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Map_RootScreen"
      screenOptions={screenOptions(TransitionPresets.SlideFromRightIOS, {
        headerShown: false,
      })}
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
        name="Map_TravelAidScreen"
        component={Map_TravelAidScreen}
      />
    </Stack.Navigator>
  );
};
