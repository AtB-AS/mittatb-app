import React from 'react';
import TravellersScreen from './Travellers';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import createDismissableStackNavigator from '../../../navigation/createDismissableStackNavigator';
import {ActiveTicketsScreenName} from '../Tickets';
import {ReserveOffer} from '../../../api/fareContracts';

type PaymentParams = {offers: ReserveOffer[]};

export type TicketingStackParams = {
  Travellers: {refreshOffer?: boolean};
  PaymentCreditCard: PaymentParams;
  PaymentVipps: PaymentParams;
  Splash: undefined;
};

const Stack = createDismissableStackNavigator<TicketingStackParams>();

export default function PurchaseStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      dismissToScreen={ActiveTicketsScreenName}
    >
      <Stack.Screen name="Travellers" component={TravellersScreen} />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      <Stack.Screen name="PaymentVipps" component={VippsScreen} />
    </Stack.Navigator>
  );
}
