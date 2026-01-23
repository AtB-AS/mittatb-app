import {Dashboard_RootScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/Dashboard_RootScreen';
import {Dashboard_TripSearchScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/Dashboard_TripSearchScreen';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {DashboardStackParams} from './navigation-types';
import {Dashboard_NearbyStopPlacesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_NearbyStopPlacesScreen';
import {Dashboard_DepartureDetailsScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_DepartureDetailsScreen';
import {Dashboard_TravelDetailsMapScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TravelDetailsMapScreen';
import {Dashboard_PlaceScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_PlaceScreen';
import {Dashboard_FavoriteDeparturesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_FavoriteDeparturesScreen';
import {Dashboard_TripDetailsScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen';
import {screenOptions} from '@atb/stacks-hierarchy/navigation-utils';
import {Dashboard_TravelAidScreen} from './Dashboard_TravelAidScreen';
import {Dashboard_SelectFavouriteDeparturesScreen} from './Dashboard_SelectFavouriteDepartureScreen';

const Stack = createStackNavigator<DashboardStackParams>();

export const TabNav_DashboardStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard_RootScreen"
      screenOptions={screenOptions(TransitionPresets.SlideFromRightIOS, {
        headerShown: false,
      })}
    >
      <Stack.Screen
        name="Dashboard_RootScreen"
        component={Dashboard_RootScreen}
      />
      <Stack.Screen
        name="Dashboard_TripSearchScreen"
        component={Dashboard_TripSearchScreen}
      />
      <Stack.Screen
        name="Dashboard_TripDetailsScreen"
        component={Dashboard_TripDetailsScreen}
      />
      <Stack.Screen
        name="Dashboard_DepartureDetailsScreen"
        component={Dashboard_DepartureDetailsScreen}
      />
      <Stack.Screen
        name="Dashboard_TravelDetailsMapScreen"
        component={Dashboard_TravelDetailsMapScreen}
      />
      <Stack.Screen
        name="Dashboard_NearbyStopPlacesScreen"
        component={Dashboard_NearbyStopPlacesScreen}
      />
      <Stack.Screen
        name="Dashboard_PlaceScreen"
        component={Dashboard_PlaceScreen}
      />
      <Stack.Screen
        name="Dashboard_FavoriteDeparturesScreen"
        component={Dashboard_FavoriteDeparturesScreen}
      />
      <Stack.Screen
        name="Dashboard_SelectFavouriteDeparturesScreen"
        component={Dashboard_SelectFavouriteDeparturesScreen}
      />
      <Stack.Screen
        name="Dashboard_TravelAidScreen"
        component={Dashboard_TravelAidScreen}
      />
    </Stack.Navigator>
  );
};
