import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AddEditFavorite from './AddEditFavorite';
import Profile from './FavoriteList';
import {LocationFavorite} from '../../favorites/types';

export type ProfileStackParams = {
  Profile: undefined;
  AddEditFavorite: {editItem?: LocationFavorite} | undefined;
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
          title: 'Legg til favorittsted',
        }}
      />
    </Stack.Navigator>
  );
}
