import React from 'react';
import AddEditFavorite from './AddEditFavorite';
import FavoriteList from './FavoriteList';
import {LocationFavorite, Location} from '../../favorites/types';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileHome from './Home';

export type ProfileStackParams = {
  ProfileHome: undefined;
  FavoriteList: undefined;
  AddEditFavorite: {
    editItem?: LocationFavorite;
    searchLocation?: Location;
  };
};

const Stack = createStackNavigator<ProfileStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator initialRouteName="ProfileHome">
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHome}
        options={{
          title: 'Mitt AtB',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FavoriteList"
        component={FavoriteList}
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
