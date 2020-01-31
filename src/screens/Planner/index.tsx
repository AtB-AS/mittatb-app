import React, {useReducer, useMemo} from 'react';
import {Location, useAppState} from '../../AppContext';
import searchJournies from './searchJournies';
import Splash from '../Splash';
import {useGeolocationState} from '../../GeolocationContext';
import {TripPattern} from '../../sdk';
import Overview from './Overview';
import {createStackNavigator} from '@react-navigation/stack';
import Detail from './Details';
import colors from '../../assets/colors';

export type PlannerStackParams = {
  Overview: undefined;
  Detail: {tripPattern: TripPattern};
};

const Stack = createStackNavigator<PlannerStackParams>();

const PlannerRoot = () => {
  const {userLocations} = useAppState();
  const {location} = useGeolocationState();

  const currentLocation = useMemo<Location | null>(
    () =>
      location
        ? {
            id: 'current',
            name: 'min posisjon',
            label: 'current',
            locality: 'current',
            coordinates: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          }
        : null,
    [location?.coords?.latitude, location?.coords?.longitude],
  );

  if (!userLocations || !currentLocation) {
    return <Splash />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        component={Overview}
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
            borderWidth: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default PlannerRoot;
