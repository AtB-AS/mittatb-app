import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DeparturesRoot, {
  DeparturesScreenParams,
  DeparturesScreenProp,
} from './Departures';
import StopPlaceScreen, {
  StopPlaceScreenParams,
} from '../Departures/StopPlaceScreen';

export type DeparturesStackParams = {
  DeparturesRoot: DeparturesScreenParams;
  StopPlaceScreen: StopPlaceScreenParams;
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
    </Stack.Navigator>
  );
};
export default DeparturesScreen;
