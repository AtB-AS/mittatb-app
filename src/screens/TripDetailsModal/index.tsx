import React from 'react';
import Details from './Details';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {TripPattern, Location} from '../../sdk';
import {RouteProp} from '@react-navigation/native';

export type DetailsRouteParams = {
  tripPattern: TripPattern;
  from: Location;
  to: Location;
};

export type DetailsModalStackParams = {
  Details: DetailsRouteParams;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsModalStackParams,
  'Details'
>;

const Stack = createSharedElementStackNavigator<DetailsModalStackParams>();

const TripDetailsRoot = ({route}: {route: DetailScreenRouteProp}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Details"
        component={Details}
        initialParams={route.params}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default TripDetailsRoot;
