import {NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import TripDetailsRoot, {DetailsStackParams} from '../TripDetails';
import DepartureDatePicker, {
  DateTimePickerParams,
} from './departure-date-picker';
import NearbyRoot, {NearbyScreenParams, NearbyScreenProp} from './Nearby';

export type NearbyStackParams = {
  NearbyRoot: NearbyScreenParams;
  TripDetails: NavigatorScreenParams<DetailsStackParams>;
  DateTimePicker: DateTimePickerParams;
};

const Stack = createStackNavigator<NearbyStackParams>();

type NearbyScreenRootProps = {
  route: NearbyScreenProp;
};

const NearbyScreen = ({route}: NearbyScreenRootProps) => {
  return (
    <Stack.Navigator
      initialRouteName="NearbyRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="NearbyRoot"
        component={NearbyRoot}
        initialParams={route.params}
      />
      <Stack.Screen name="TripDetails" component={TripDetailsRoot} />
      <Stack.Screen name="DateTimePicker" component={DepartureDatePicker} />
    </Stack.Navigator>
  );
};
export default NearbyScreen;
