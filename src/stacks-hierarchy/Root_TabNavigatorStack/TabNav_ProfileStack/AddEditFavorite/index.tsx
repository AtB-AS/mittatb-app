import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AddEditForm from './AddForm';
import {SearchStopPlace as SearchLocation} from './SearchLocation';
import {AddEditFavoriteRootParams} from './types';

const Stack = createStackNavigator<AddEditFavoriteRootParams>();

// @TODO This should be moved outside of Profile as it is separate screen.
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
