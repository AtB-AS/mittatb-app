import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {LocationSearchByTextScreen} from './LocationSearchByTextScreen';
import {LocationSearchByMapScreen} from './LocationSearchByMapScreen';
import {LocationSearchStackParams} from '@atb/location-search/navigation-types';

const Stack = createStackNavigator<LocationSearchStackParams>();

export const LocationSearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LocationSearchByTextScreen"
        component={LocationSearchByTextScreen}
      />
      <Stack.Screen
        name="LocationSearchByMapScreen"
        component={LocationSearchByMapScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
