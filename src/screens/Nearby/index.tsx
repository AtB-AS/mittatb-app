import {usePreferences} from '@atb/preferences';
import {NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import TripDetailsRoot, {DetailsStackParams} from '../TripDetails';
import NearbyRoot, {NearbyScreenParams, NearbyScreenProp} from './Nearby';
import DeparturesRoot from '../Departures/Departures';
import StopPlaceScreen, {
  StopPlaceScreenParams,
} from '../Departures/StopPlaceScreen';

export type NearbyStackParams = {
  NearbyRoot: NearbyScreenParams;
  TripDetails: NavigatorScreenParams<DetailsStackParams>;
  StopPlaceScreen: StopPlaceScreenParams;
};

const Stack = createStackNavigator<NearbyStackParams>();

type NearbyScreenRootProps = {
  route: NearbyScreenProp;
};

const NearbyScreen = ({route}: NearbyScreenRootProps) => {
  const {
    preferences: {newDepartures},
  } = usePreferences();

  return (
    <Stack.Navigator
      initialRouteName="NearbyRoot"
      screenOptions={{headerShown: false}}
    >
      {newDepartures ? (
        <Stack.Screen
          name="NearbyRoot"
          component={DeparturesRoot}
          initialParams={route.params}
        />
      ) : (
        <Stack.Screen
          name="NearbyRoot"
          component={NearbyRoot}
          initialParams={route.params}
        />
      )}
      <Stack.Screen name="TripDetails" component={TripDetailsRoot} />
      <Stack.Screen name="StopPlaceScreen" component={StopPlaceScreen} />
    </Stack.Navigator>
  );
};
export default NearbyScreen;
