import React from 'react';
import TravellersScreen from './Travellers';
import PaymentOptionsScreen from './PaymentOptions';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import createDismissableStackNavigator from '../../../navigation/createDismissableStackNavigator';
import {ActiveTicketsScreenName} from '../Tickets';
import {ReserveOffer} from '../../../api/fareContracts';
import {TravellerWithCount} from './traveller-types';

type PaymentOptionsParams = {
  refreshOffer?: boolean;
  travellers: TravellerWithCount[];
};
type PaymentParams = {
  offers: ReserveOffer[];
  travellers: TravellerWithCount[];
};

export type TicketingStackParams = {
  Travellers: undefined;
  PaymentOptions: PaymentOptionsParams;
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
      <Stack.Screen name="PaymentOptions" component={PaymentOptionsScreen} />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      <Stack.Screen name="PaymentVipps" component={VippsScreen} />
    </Stack.Navigator>
  );
}
