import React from 'react';
import Details, {DetailsRouteParams, DetailScreenRouteProp} from './Details';
import {createStackNavigator} from '@react-navigation/stack';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from './DepartureDetails';

export type DetailsModalStackParams = {
  Details: DetailsRouteParams;
  DepartureDetails: DepartureDetailsRouteParams;
};

export type RouteParams = DetailsRouteParams;

const Stack = createStackNavigator<DetailsModalStackParams>();

type TripDetailsRootProps = {
  route: DetailScreenRouteProp;
};

const TripDetailsRoot = ({route}: TripDetailsRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Details"
        component={Details}
        initialParams={route.params}
      />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
    </Stack.Navigator>
  );
};

export default TripDetailsRoot;
