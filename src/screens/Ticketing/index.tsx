import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ReserveTicketResponse} from '../../api/fareContracts';
import TicketContextProvider from './TicketContext';
import TicketsScreen from './Tickets';
import OfferScreen from './Offer';
import {
  Method as PaymentMethodScreen,
  CreditCard as CreditCardScreen,
  Vipps as VippsScreen,
} from './Payment';
import Splash from './Splash';
import {Features, useFeatureToggle} from '../../FeatureToggleContext';

interface VippsPaymentResponse {}

export type TicketingStackParams = {
  Tickets: undefined;
  Offer: undefined;
  PaymentMethod: {offers: {offer_id: string; count: number}[]};
  PaymentCreditCard: ReserveTicketResponse;
  PaymentVipps: ReserveTicketResponse;
};

const Stack = createStackNavigator<TicketingStackParams>();

export default function Ticketing() {
  const ticketingEnabled = useFeatureToggle(Features.Ticketing);

  return !ticketingEnabled ? (
    <Splash />
  ) : (
    <TicketContextProvider>
      <Stack.Navigator>
        <Stack.Screen name="Tickets" component={TicketsScreen} />
        <Stack.Screen name="Offer" component={OfferScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
        <Stack.Screen name="PaymentVipps" component={VippsScreen} />
      </Stack.Navigator>
    </TicketContextProvider>
  );
}
