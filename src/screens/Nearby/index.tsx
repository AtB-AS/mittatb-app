import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import TripDetailsRoot from '../TripDetails';
import NearbyRoot from './Nearby';
import {NearbyStackParams, RootNearbyScreenProps} from './types';

const Stack = createStackNavigator<NearbyStackParams>();

const NearbyScreen = ({}: RootNearbyScreenProps) => {
  return (
    <Stack.Navigator
      initialRouteName="NearbyRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="NearbyRoot" component={NearbyRoot} />
      <Stack.Screen name="TripDetails" component={TripDetailsRoot} />
    </Stack.Navigator>
  );
};
export default NearbyScreen;
