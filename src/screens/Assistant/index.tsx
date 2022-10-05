import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import TripDetailsRoot from '../TripDetails';
import AssistantRoot from './Assistant';
import JourneyDatePicker from './journey-date-picker';
import {AssistantParams} from './types';

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
