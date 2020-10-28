import React from 'react';
import {Modal} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ReserveTicketResponse,
  VippsRedirectParams,
} from '../../../api/fareContracts';
import TravellersScreen from './Travellers';
import {
  Method as PaymentMethodScreen,
  CreditCard as CreditCardScreen,
  Vipps as VippsScreen,
} from './Payment';

export type TicketingStackParams = {
  Travellers: undefined;
  PaymentMethod: {offers: {offer_id: string; count: number}[]};
  PaymentCreditCard: ReserveTicketResponse;
  PaymentVipps: VippsRedirectParams;
  Splash: undefined;
};

const Stack = createStackNavigator<TicketingStackParams>();

export default function PurchaseStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Travellers" component={TravellersScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      <Stack.Screen name="PaymentVipps" component={VippsScreen} />
    </Stack.Navigator>
  );
}
