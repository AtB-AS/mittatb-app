import React from 'react';
import TicketsScreen from './Tickets';
import OfferScreen from './Offer';
import {
  Method as PaymentMethodScreen,
  CreditCard as CreditCardScreen,
} from './Payment';
import {createStackNavigator} from '@react-navigation/stack';

export type TicketingStackParams = {
  Tickets: undefined;
  Offer: undefined;
  PaymentMethod: undefined;
  PaymentCreditCard: undefined;
};

const Stack = createStackNavigator<TicketingStackParams>();

export default function Ticketing() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tickets" component={TicketsScreen} />
      <Stack.Screen name="Offer" component={OfferScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
    </Stack.Navigator>
  );
}
