import React from 'react';
import TravellersScreen from './Travellers';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import createDismissableStackNavigator from '../../../navigation/createDismissableStackNavigator';
import {ActiveTicketsScreenName} from '../Tickets';
import {PreassignedFareProduct, ReserveOffer} from '../../../api/fareContracts';
import {RouteProp} from '@react-navigation/core';
import TariffZones, {TariffZoneWithMetadata} from './TariffZones';
import {RouteParams as TariffZoneSearchParams} from '../../../tariff-zone-search';

import transitionSpec from '../../../navigation/transitionSpec';
import TariffZoneSearch from '../../../tariff-zone-search';

type TravellersParams = {
  refreshOffer?: boolean;
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
};

type TariffZonesParams = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
};
type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

export type TicketingStackParams = {
  Travellers: TravellersParams;
  TariffZones: TariffZonesParams;
  TariffZoneSearch: TariffZoneSearchParams;
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
      <Stack.Screen name="TariffZones" component={TariffZones} />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      <Stack.Screen name="PaymentVipps" component={VippsScreen} />
      <Stack.Screen
        name="TariffZoneSearch"
        component={TariffZoneSearch}
        options={{
          transitionSpec: {
            open: transitionSpec,
            close: transitionSpec,
          },
        }}
      />
    </Stack.Navigator>
  );
}
