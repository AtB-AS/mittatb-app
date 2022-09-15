import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MapScreen} from '@atb/screens/Map/MapScreen';

export type MapStackNavigatorParams = {
  MapScreen: undefined;
};

const Stack = createStackNavigator<MapStackNavigatorParams>();

const MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="MapScreen"
    >
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
};

export default MapStack;
