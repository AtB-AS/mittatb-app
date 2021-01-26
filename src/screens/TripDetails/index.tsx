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
import {MapDetailRouteParams, TravelDetailsMap} from './Map';

export type DetailsStackParams = {
  Details: DetailsRouteParams;
  DepartureDetails: DepartureDetailsRouteParams;
  DetailsMap: MapDetailRouteParams;
};

export type DetailsModalNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DetailsStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export type RouteParams = DetailsRouteParams;

const Stack = createStackNavigator<DetailsStackParams>();

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
        name="DetailsMap"
        component={TravelDetailsMap}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
    </Stack.Navigator>
  );
};

export default TripDetailsRoot;
