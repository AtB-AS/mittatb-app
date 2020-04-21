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
import {RootStackParamList} from '../../navigation';

export type DetailsModalStackParams = {
  Details: DetailsRouteParams;
  DepartureDetails: DepartureDetailsRouteParams;
};

export type DetailsModalNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DetailsModalStackParams>,
  StackNavigationProp<RootStackParamList>
>;

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
      <Stack.Screen
        name="DepartureDetails"
        component={DepartureDetails}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default TripDetailsRoot;
