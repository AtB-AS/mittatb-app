import React from 'react';
import {TripPattern} from '../../sdk';
import Overview from './Overview';
import Detail from './Details';
import colors from '../../theme/colors';
import {Location} from '../../favorites/types';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

export type PlannerStackParams = {
  Overview: {fromLocation: Location; toLocation: Location};
  Detail: {tripPattern: TripPattern; from: Location; to: Location};
};

const Stack = createSharedElementStackNavigator<PlannerStackParams>();

const PlannerRoot = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        component={Overview}
        options={{
          headerShown: false,
        }}
        sharedElementsConfig={() => [
          {id: 'locationSearchInput', animation: 'fade-in'},
        ]}
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
