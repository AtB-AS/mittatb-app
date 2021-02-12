import {ReserveOffer} from '@atb/api/fareContracts';
import createDismissableStackNavigator from '@atb/navigation/createDismissableStackNavigator';
import transitionSpec from '@atb/navigation/transitionSpec';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {BuyTicketsScreenName} from '../Tickets';
import ConfirmationScreen, {
  RouteParams as ConfirmationRouteParams,
} from './Confirmation';
import PurchaseOverviewScreen from './Overview';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import ProductScreen, {ProductRouteParams} from './Product';
import TariffZones, {
  RouteParams as TariffZonesParams,
  TariffZoneWithMetadata,
} from './TariffZones';
import TariffZoneSearch, {
  RouteParams as TariffZoneSearchParams,
} from './TariffZones/search';
import TravellersScreen from './Travellers';
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
  Product: ProductRouteParams;
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
      <Stack.Screen name="Product" component={ProductScreen} />
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
