import {CompositeNavigationProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import {RootStackParamList} from '../../../navigation';
import AddFavoriteDeparture from './AddFavoriteDeparture';
import FavoriteDepartures from './FavoriteDepartureList';

export type FavoriteDeparturesStackParams = {
  FavoriteDepartureList: undefined;
  AddFavoriteDeparture: undefined;
};

export type FavoriteDepartureNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FavoriteDeparturesStackParams>,
  StackNavigationProp<RootStackParamList>
>;

const Stack = createStackNavigator<FavoriteDeparturesStackParams>();

export default function FavoriteDeaprtureRoot() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} mode="modal">
      <Stack.Screen
        name="FavoriteDepartureList"
        component={FavoriteDepartures}
      />
      <Stack.Screen
        name="AddFavoriteDeparture"
        component={AddFavoriteDeparture}
      />
    </Stack.Navigator>
  );
}
