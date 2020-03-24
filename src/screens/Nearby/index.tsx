import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {LocationWithSearchMetadata} from '../../location-search';
import NearbyScreen from './Overview';

export type NearbyStackParams = {
  Nearby: {
    location: LocationWithSearchMetadata;
  };
};

const Stack = createSharedElementStackNavigator<NearbyStackParams>();

const PlannerRoot = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default PlannerRoot;
