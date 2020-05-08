import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ReserveTicketResponse} from '../../api/fareContracts';
import TicketContextProvider from './TicketContext';
import TicketsScreen from './Tickets';
import OfferScreen from './Offer';
import {
  Method as PaymentMethodScreen,
  CreditCard as CreditCardScreen,
} from './Payment';

export type TicketingStackParams = {
  Tickets: undefined;
  Offer: undefined;
  PaymentMethod: {offers: string[]};
  PaymentCreditCard: ReserveTicketResponse;
};

const Stack = createStackNavigator<TicketingStackParams>();

export default function Ticketing() {
  return (
    <TicketContextProvider>
      <Stack.Navigator>
        <Stack.Screen name="Tickets" component={TicketsScreen} />
        <Stack.Screen name="Offer" component={OfferScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      </Stack.Navigator>
    </TicketContextProvider>
  );
}
