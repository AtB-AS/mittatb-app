import React from 'react';
import {TripPattern} from '../../sdk';
import Assistant from './Overview';
import Detail from '../../TripDetailsModal';
import {Location} from '../../favorites/types';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {LocationWithSearchMetadata} from '../../location-search';
import {TransitionPresets} from '@react-navigation/stack';

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
    <Stack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
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
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default PlannerRoot;
