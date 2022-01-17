import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DeparturesRoot, {
  DeparturesScreenParams,
  DeparturesScreenProp,
} from './Departures';
import StopPlaceScreen, {
  StopPlaceScreenParams,
} from '../Departures/StopPlaceScreen';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../TripDetails/DepartureDetails';

export type DeparturesStackParams = {
  DeparturesRoot: DeparturesScreenParams;
  StopPlaceScreen: StopPlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
};

const Stack = createStackNavigator<DeparturesStackParams>();

type DeparturesScreenRootProps = {
  route: DeparturesScreenProp;
};

const DeparturesScreen = ({route}: DeparturesScreenRootProps) => {
  return (
    <Stack.Navigator
      initialRouteName="DeparturesRoot"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="DeparturesRoot"
        component={DeparturesRoot}
        initialParams={route.params}
      />
      <Stack.Screen name="StopPlaceScreen" component={StopPlaceScreen} />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
    </Stack.Navigator>
  );
};
export default DeparturesScreen;
