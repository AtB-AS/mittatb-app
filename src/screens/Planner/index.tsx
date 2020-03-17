import React from 'react';
import {TripPattern} from '../../sdk';
import Assistant from './Overview';
import {Location} from '../../favorites/types';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {LocationWithSearchMetadata} from '../../location-search';

export type PlannerStackParams = {
  Assistant: {
    fromLocation: LocationWithSearchMetadata;
    toLocation: LocationWithSearchMetadata;
  };
  Detail: {tripPattern: TripPattern; from: Location; to: Location};
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
