import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import AddEditFavorite from './AddEditFavorite';
import Profile from './FavoriteList';
import {LocationFavorite} from '../../favorites/types';
import {LocationSearchCallerRouteParams} from '../../location-search';

export type ProfileStackParams = {
  Profile: undefined;
  AddEditFavorite: {
    editItem?: LocationFavorite;
  } & LocationSearchCallerRouteParams;
};

const Stack = createSharedElementStackNavigator<ProfileStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Mitt AtB',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEditFavorite"
        component={AddEditFavorite}
        options={{
          title: 'Legg til favorittsted',
        }}
      />
    </Stack.Navigator>
  );
}
