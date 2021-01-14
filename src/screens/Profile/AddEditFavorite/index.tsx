import {CompositeNavigationProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import {RootStackParamList} from '../../../navigation';
import AddEditForm, {AddEditParams} from './AddForm';
import SearchLocation from './SearchLocation';

export type AddEditFavoriteRootParams = {
  SearchLocation: undefined;
  AddEditForm: AddEditParams;
};

export type LocationSearchNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AddEditFavoriteRootParams>,
  StackNavigationProp<RootStackParamList>
>;

const Stack = createStackNavigator<AddEditFavoriteRootParams>();

export default function AddFavoriteDeparture() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="SearchLocation"
    >
      <Stack.Screen name="SearchLocation" component={SearchLocation} />
      <Stack.Screen name="AddEditForm" component={AddEditForm} />
    </Stack.Navigator>
  );
}
