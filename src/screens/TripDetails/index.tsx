import React from 'react';
import Details, {DetailsRouteParams, DetailScreenRouteProp} from './Details';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from './DepartureDetails';
import {CompositeNavigationProp} from '@react-navigation/native';
import {MapDetailRouteParams, TravelDetailsMap} from './Map';
import {TabNavigatorParams} from '@atb/navigation/TabNavigator';
import QuayDepartures, {
  QuayDeparturesRouteParams,
} from '@atb/screens/TripDetails/QuayDepartures';
import PlaceScreen, {
  PlaceScreenParams,
} from '@atb/screens/Departures/PlaceScreen';

export type DetailsStackParams = {
  Details: DetailsRouteParams;
  DepartureDetails: DepartureDetailsRouteParams;
  DetailsMap: MapDetailRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  PlaceScreen: PlaceScreenParams;
};

export type DetailsModalNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DetailsStackParams>,
  StackNavigationProp<TabNavigatorParams>
>;

export type RouteParams = DetailsRouteParams;

const Stack = createStackNavigator<DetailsStackParams>();

type TripDetailsRootProps = {
  route: DetailScreenRouteProp;
};

export const TripDetailsRoot = ({route}: TripDetailsRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Details"
        component={Details}
        initialParams={route.params}
      />
      <Stack.Screen
        name="DetailsMap"
        component={TravelDetailsMap}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen name="QuayDepartures" component={QuayDepartures} />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
      <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
    </Stack.Navigator>
  );
};

export default TripDetailsRoot;
