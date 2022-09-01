import createDismissableStackNavigator from '@atb/navigation/createDismissableStackNavigator';
import transitionSpec from '@atb/navigation/transitionSpec';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
} from '@atb/reference-data/types';
import {ReserveOffer} from '@atb/tickets';
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {BuyTicketsScreenName} from '../Tickets';
import ConfirmationScreen, {
  RouteParams as ConfirmationRouteParams,
} from './Confirmation';
import PurchaseOverviewScreen from './Overview';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import TariffZones, {
  RouteParams as TariffZonesParams,
  TariffZoneWithMetadata,
} from './TariffZones';
import TariffZoneSearch, {
  RouteParams as TariffZoneSearchParams,
} from './TariffZones/search';
import {TransitionPresets} from '@react-navigation/stack';
import {CardPaymentMethod} from './types';
import ConsequencesScreen from '@atb/screens/AnonymousTicketPurchase/ConsequencesScreen';
import {UserProfileWithCount} from './Travellers/use-user-count-state';
import {useGoToMobileTokenOnboardingWhenNecessary} from '@atb/screens/MobileTokenOnboarding/utils';

type PurchaseOverviewParams = {
  refreshOffer?: boolean;
  selectableProductType?: PreassignedFareProductType;
  preassignedFareProduct?: PreassignedFareProduct;
  userProfilesWithCount?: UserProfileWithCount[];
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  travelDate?: string;
};

type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

export type TicketingStackParams = {
  PurchaseOverview: PurchaseOverviewParams;
  TariffZones: TariffZonesParams;
  TariffZoneSearch: TariffZoneSearchParams;
  Confirmation: ConfirmationRouteParams;
  PaymentCreditCard: PaymentParams & {paymentMethod: CardPaymentMethod};
  PaymentVipps: PaymentParams;
  Splash: undefined;
  ConsequencesFromTicketPurchase: undefined;
};

const Stack = createDismissableStackNavigator<TicketingStackParams>();

type TicketPurchaseRootProps = {
  route: RouteProp<TicketingStackParams, 'PurchaseOverview'>;
};

export default function PurchaseStack({route}: TicketPurchaseRootProps) {
  useGoToMobileTokenOnboardingWhenNecessary();
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
      <Stack.Screen
        name="ConsequencesFromTicketPurchase"
        component={ConsequencesScreen}
      />
      <Stack.Screen name="TariffZones" component={TariffZones} />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
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
