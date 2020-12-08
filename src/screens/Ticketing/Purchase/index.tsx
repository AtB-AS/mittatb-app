import React from 'react';
import TravellersScreen, {TravellersProps} from './Travellers';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import createDismissableStackNavigator from '../../../navigation/createDismissableStackNavigator';
import {ActiveTicketsScreenName} from '../Tickets';
import {PreassignedFareProduct, ReserveOffer} from '../../../api/fareContracts';
import {RouteProp} from '@react-navigation/core';

type TravellersParams = {
  refreshOffer?: boolean;
  preassignedFareProduct: PreassignedFareProduct;
};
type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

export type TicketingStackParams = {
  Travellers: TravellersParams;
  PaymentCreditCard: PaymentParams;
  PaymentVipps: PaymentParams;
  Splash: undefined;
};

const Stack = createDismissableStackNavigator<TicketingStackParams>();

export type RouteParams = TravellersParams;

type TicketPurchaseRootProps = {
  route: RouteProp<TicketingStackParams, 'Travellers'>;
};

export default function PurchaseStack({route}: TicketPurchaseRootProps) {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      dismissToScreen={ActiveTicketsScreenName}
    >
      <Stack.Screen
        name="Travellers"
        component={TravellersScreen}
        initialParams={route.params}
      />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      <Stack.Screen name="PaymentVipps" component={VippsScreen} />
    </Stack.Navigator>
  );
}
