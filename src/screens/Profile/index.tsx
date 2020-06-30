import React from 'react';
import AddEditFavorite from './AddEditFavorite';
import Profile from './FavoriteList';
import {LocationFavorite, Location} from '../../favorites/types';
import {createStackNavigator} from '@react-navigation/stack';

export type ProfileStackParams = {
  Profile: undefined;
  AddEditFavorite: {
    editItem?: LocationFavorite;
    searchLocation?: Location;
  };
};

const Stack = createStackNavigator<ProfileStackParams>();

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
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
