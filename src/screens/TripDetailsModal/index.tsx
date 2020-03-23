import React from 'react';
import Details, {DetailsRouteParams, DetailScreenRouteProp} from './Details';
import {createStackNavigator} from '@react-navigation/stack';
import Stops, {StopRouteParams} from './Stops';

export type DetailsModalStackParams = {
  Details: DetailsRouteParams;
  Stops: StopRouteParams;
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
      <Stack.Screen name="Stops" component={Stops} />
    </Stack.Navigator>
  );
};

export default TripDetailsRoot;
