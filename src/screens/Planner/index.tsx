import React from 'react';
import Assistant from './Overview';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {LocationWithSearchMetadata} from '../../location-search';

export type PlannerStackParams = {
  Assistant: {
    fromLocation: LocationWithSearchMetadata;
    toLocation: LocationWithSearchMetadata;
  };
};

const Stack = createSharedElementStackNavigator<PlannerStackParams>();

const PlannerRoot = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Assistant"
        component={Assistant}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default PlannerRoot;
