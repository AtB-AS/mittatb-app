import React from 'react';
import {TripPattern} from '../../sdk';
import Assistant from './Overview';
import Detail from './Details';
import colors from '../../theme/colors';
import {Location} from '../../favorites/types';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

export type PlannerStackParams = {
  Assistant: {fromLocation: Location; toLocation: Location};
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
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerTintColor: colors.general.white,
          headerBackTitleVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.primary.gray,
            shadowOpacity: 0,
            borderWidth: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default PlannerRoot;
