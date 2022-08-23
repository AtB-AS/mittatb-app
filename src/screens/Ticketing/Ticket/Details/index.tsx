import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '@atb/navigation';
import DetailsScreen, {TicketDetailsRouteParams} from './DetailsScreen';
import ReceiptScreen, {ReceiptScreenRouteParams} from './ReceiptScreen';
import CarnetDetailsScreen, {
  CarnetDetailsRouteParams,
} from '@atb/screens/Ticketing/Ticket/Carnet/CarnetDetailsScreen';

export type TicketModalStackParams = {
  TicketDetails: TicketDetailsRouteParams;
  TicketReceipt: ReceiptScreenRouteParams;
  CarnetDetailsScreen: CarnetDetailsRouteParams;
};

export type TicketModalNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TicketModalStackParams>,
  StackNavigationProp<RootStackParamList>
>;

const Stack = createStackNavigator<TicketModalStackParams>();

export type TicketModalRouteParams = TicketDetailsRouteParams;
type TicketModalRouteProp = RouteProp<TicketModalStackParams, 'TicketDetails'>;

export type TicketModalRootProps = {
  route: TicketModalRouteProp;
};

const TicketModalRoot = ({route}: TicketModalRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="TicketDetails"
        component={DetailsScreen}
        initialParams={route.params}
      />
      <Stack.Screen
        name="CarnetDetailsScreen"
        component={CarnetDetailsScreen}
        initialParams={route.params}
      />
      <Stack.Screen name="TicketReceipt" component={ReceiptScreen} />
    </Stack.Navigator>
  );
};

export default TicketModalRoot;
