import React from 'react';
import Details, {DetailsRouteParams, DetailScreenRouteProp} from './Details';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Stops, {StopRouteParams} from './Stops';
import {TransitionPresets} from '@react-navigation/stack';

export type DetailsModalStackParams = {
  Details: DetailsRouteParams;
  Stops: StopRouteParams;
};

export type RouteParams = DetailsRouteParams;

const Stack = createSharedElementStackNavigator<DetailsModalStackParams>();

type TripDetailsRootProps = {
  route: DetailScreenRouteProp;
};

const TripDetailsRoot = ({route}: TripDetailsRootProps) => {
  return (
    <Stack.Navigator mode="modal" screenOptions={{headerShown: false}}>
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
