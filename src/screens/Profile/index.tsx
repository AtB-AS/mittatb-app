import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Appearance from './Appearance';
import FavoriteList from './FavoriteList';
import ProfileHome from './Home';
import SelectStartScreen from './SelectStartScreen';

export type ProfileStackParams = {
  ProfileHome: undefined;
  FavoriteList: undefined;
  SelectStartScreen: undefined;
  Appearance: undefined;
};

const Stack = createStackNavigator<ProfileStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="FavoriteList" component={FavoriteList} />
      <Stack.Screen name="SelectStartScreen" component={SelectStartScreen} />
      <Stack.Screen name="Appearance" component={Appearance} />
    </Stack.Navigator>
  );
}
