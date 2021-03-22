import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import Login from './Login';
import Appearance from './Appearance';
import FavoriteDepartures from './FavoriteDepartures';
import FavoriteList from './FavoriteList';
import ProfileHome from './Home';
import Language from './Language';
import SelectStartScreen from './SelectStartScreen';
import DesignSystem from './DesignSystem';

export type ProfileStackParams = {
  ProfileHome: undefined;
  FavoriteList: undefined;
  FavoriteDepartures: undefined;
  SelectStartScreen: undefined;
  Appearance: undefined;
  Language: undefined;
  DesignSystem: undefined;
};

const Stack = createStackNavigator<ProfileStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="FavoriteList" component={FavoriteList} />
      <Stack.Screen name="FavoriteDepartures" component={FavoriteDepartures} />
      <Stack.Screen name="SelectStartScreen" component={SelectStartScreen} />
      <Stack.Screen name="Appearance" component={Appearance} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="DesignSystem" component={DesignSystem} />
    </Stack.Navigator>
  );
}
