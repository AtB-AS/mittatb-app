import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
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
import QuayDepartures, {
  QuayDeparturesRouteParams,
} from '../TripDetails/QuayDepartures';
import TripDetailsRoot, {DetailsStackParams} from '../TripDetails';
import TravelDetailsMap, {MapDetailRouteParams} from '../TripDetails/Map';

export type DeparturesStackParams = {
  DeparturesRoot: DeparturesScreenParams;
  StopPlaceScreen: StopPlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
  DetailsMap: MapDetailRouteParams;
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
      <Stack.Screen name="QuayDepartures" component={QuayDepartures} />
      <Stack.Screen name="TripDetails" component={TripDetailsRoot} />
      <Stack.Screen
        name="DetailsMap"
        component={TravelDetailsMap}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};
export default DeparturesScreen;
