import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {LocationWithMetadata} from '@atb/favorites/types';
import {DetailsRouteParams} from '../TripDetails/Details';
import TripDetailsRoot from '../TripDetails';
import AssistantRoot from './Assistant';
import JourneyDatePicker, {
  DateTimePickerParams,
  SearchTime,
} from './journey-date-picker';

export type AssistantParams = {
  AssistantRoot: {
    fromLocation: LocationWithMetadata;
    toLocation: LocationWithMetadata;
    searchTime: SearchTime;
  };
  TripDetails: DetailsRouteParams;
  DateTimePicker: DateTimePickerParams;
};

const Stack = createStackNavigator<AssistantParams>();

const Assistant = () => {
  return (
    <Stack.Navigator
      initialRouteName="AssistantRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="AssistantRoot"
        component={AssistantRoot}
      ></Stack.Screen>
      <Stack.Screen
        name="TripDetails"
        component={TripDetailsRoot}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="DateTimePicker"
        component={JourneyDatePicker}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
export default Assistant;
