import {CompositeNavigationProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import {RootStackParamList} from '../../../../navigation';
import SearchStopPlace from './SearchStopPlace';
import SelectLine, {SelectLineRouteParams} from './SelectLine';

export type LocationSearchStackParams = {
  StopPlaceSearch: undefined;
  SelectLine: SelectLineRouteParams;
};

export type LocationSearchNavigationProp = CompositeNavigationProp<
  StackNavigationProp<LocationSearchStackParams>,
  StackNavigationProp<RootStackParamList>
>;

const Stack = createStackNavigator<LocationSearchStackParams>();

export default function AddFavoriteDeparture() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StopPlaceSearch" component={SearchStopPlace} />
      <Stack.Screen name="SelectLine" component={SelectLine} />
    </Stack.Navigator>
  );
}
