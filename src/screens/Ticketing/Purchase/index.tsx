import React from 'react';
import PurchaseOverviewScreen from './Overview';
import ConfirmationScreen, {
  RouteParams as ConfirmationRouteParams,
} from './Confirmation';
import TravellersScreen from './Travellers';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import createDismissableStackNavigator from '../../../navigation/createDismissableStackNavigator';
import {BuyTicketsScreenName} from '../Tickets';
import {ReserveOffer} from '../../../api/fareContracts';
import {RouteProp} from '@react-navigation/native';
import TariffZones, {
  TariffZoneWithMetadata,
  RouteParams as TariffZonesParams,
} from './TariffZones';
import TariffZoneSearch, {
  RouteParams as TariffZoneSearchParams,
} from './TariffZones/search';

import transitionSpec from '../../../navigation/transitionSpec';
import {PreassignedFareProduct} from '../../../reference-data/types';
import {UserProfileWithCount} from './Travellers/use-user-count-state';

type PurchaseOverviewParams = {
  refreshOffer?: boolean;
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  userProfilesWithCount?: UserProfileWithCount[];
};

type TravellersParams = {
  userProfilesWithCount: UserProfileWithCount[];
};

type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

export type TicketingStackParams = {
  PurchaseOverview: PurchaseOverviewParams;
  Travellers: TravellersParams;
  TariffZones: TariffZonesParams;
  TariffZoneSearch: TariffZoneSearchParams;
  Confirmation: ConfirmationRouteParams;
  PaymentCreditCard: PaymentParams;
  PaymentVipps: PaymentParams;
  Splash: undefined;
};

const Stack = createDismissableStackNavigator<TicketingStackParams>();

export type RouteParams = PurchaseOverviewParams;

type TicketPurchaseRootProps = {
  route: RouteProp<TicketingStackParams, 'Travellers'>;
};

export default function PurchaseStack({route}: TicketPurchaseRootProps) {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      dismissToScreen={BuyTicketsScreenName}
    >
      <Stack.Screen
        name="PurchaseOverview"
        component={PurchaseOverviewScreen}
        initialParams={route.params}
      />
      <Stack.Screen name="Travellers" component={TravellersScreen} />
      <Stack.Screen name="TariffZones" component={TariffZones} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
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
