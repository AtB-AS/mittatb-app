import {Dashboard_RootScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/Dashboard_RootScreen';
import {Dashboard_TripSearchScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/Dashboard_TripSearchScreen';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {DashboardStackParams} from './navigation-types';
import {Dashboard_NearbyStopPlacesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_NearbyStopPlacesScreen';
import {Dashboard_DepartureDetailsScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_DepartureDetailsScreen';
import {Dashboard_TravelDetailsMapScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TravelDetailsMapScreen';
import {Dashboard_PlaceScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_PlaceScreen';
import {Dashboard_FavoriteDeparturesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_FavoriteDeparturesScreen';
import {Dashboard_TripDetailsScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen';
import {Dashboard_JourneyDatePickerScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_JourneyDatePickerScreen';
import {transitionOptions} from '@atb/stacks-hierarchy/navigation-utils';

const Stack = createStackNavigator<DashboardStackParams>();

export const TabNav_DashboardStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard_RootScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="Dashboard_RootScreen"
        component={Dashboard_RootScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_TripSearchScreen"
        component={Dashboard_TripSearchScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_TripDetailsScreen"
        component={Dashboard_TripDetailsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_DepartureDetailsScreen"
        component={Dashboard_DepartureDetailsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_TravelDetailsMapScreen"
        component={Dashboard_TravelDetailsMapScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_JourneyDatePickerScreen"
        component={Dashboard_JourneyDatePickerScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_NearbyStopPlacesScreen"
        component={Dashboard_NearbyStopPlacesScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_PlaceScreen"
        component={Dashboard_PlaceScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Dashboard_FavoriteDeparturesScreen"
        component={Dashboard_FavoriteDeparturesScreen}
        options={transitionOptions()}
      />
    </Stack.Navigator>
  );
};
