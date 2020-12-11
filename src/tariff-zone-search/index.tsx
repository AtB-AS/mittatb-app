import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import TariffZoneSearch, {
  RouteParams as TariffZoneSearchRouteParams,
} from './TariffZoneSearch';
import {CompositeNavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation';

export type TariffZoneSearchStackParams = {
  TariffZoneSearch: TariffZoneSearchRouteParams;
};

export type TariffZoneSearchNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TariffZoneSearchStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export type RouteParams = TariffZoneSearchRouteParams;

const Stack = createStackNavigator<TariffZoneSearchStackParams>();

type TariffZoneSearchRootProps = {
  route: {params: RouteParams};
};

const TariffZoneSearchRoot = ({route}: TariffZoneSearchRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="TariffZoneSearch"
        component={TariffZoneSearch}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
};

export default TariffZoneSearchRoot;
