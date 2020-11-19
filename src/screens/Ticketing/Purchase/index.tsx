import React from 'react';
import TravellersScreen from './Travellers';
import {
  CreditCard as CreditCardScreen,
  Vipps as VippsScreen,
  VippsCallback as VippsCallbackScreen,
} from './Payment';
import createDismissableStackNavigator from '../../../navigation/createDismissableStackNavigator';
import {ActiveTicketsScreenName} from '../Tickets';

export type TicketingStackParams = {
  Travellers: {refreshOffer?: boolean};
  PaymentCreditCard: {offer_id: string; count: number};
  PaymentVipps: {offer_id: string; count: number};
  VippsCallback: {status: string; transaction_id: string; payment_id: string};
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
      <Stack.Screen name="VippsCallback" component={VippsCallbackScreen} />
    </Stack.Navigator>
  );
}
