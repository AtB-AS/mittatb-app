import {LoginInAppStackParams} from '@atb/login/types';
import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {Location, SearchLocation, StoredLocationFavorite} from '@atb/favorites';
import {Root_LocationSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {FareProductTypeConfig} from '@atb/configuration';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {Root_PurchaseTariffZonesSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByTextScreen/navigation-types';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {ReserveOffer} from '@atb/ticketing';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {CardPaymentMethod} from '@atb/stacks-hierarchy/types';

export type Root_AddEditFavoritePlaceScreenParams = {
  editItem?: StoredLocationFavorite;
  searchLocation?: SearchLocation;
};

export type Root_PurchaseTariffZonesSearchByMapScreenParams = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  fareProductTypeConfig: FareProductTypeConfig;
};

export type Root_LocationSearchByMapScreenParams = {
  callerRouteName: string;
  callerRouteParam: string;
  initialLocation?: Location;
};

type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

type CarnetDetailsRouteParams = {
  orderId: string;
  isInspectable: boolean;
};

type ReceiptScreenRouteParams = {
  orderId: string;
  orderVersion: string;
};

type FareContractDetailsRouteParams = {
  orderId: string;
};

export type RootStackParamList = {
  NotFound: undefined;
  Root_OnboardingStack: undefined;
  Root_TipsAndInformation: undefined;
  Root_TicketAssistantStack: undefined;
  Root_TabNavigatorStack: NavigatorScreenParams<TabNavigatorStackParams>;
  Root_LocationSearchByTextScreen: Root_LocationSearchByTextScreenParams;
  Root_LocationSearchByMapScreen: Root_LocationSearchByMapScreenParams;
  Root_AddEditFavoritePlaceScreen: Root_AddEditFavoritePlaceScreenParams;
  Root_SearchStopPlaceScreen: undefined;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
  Root_PurchaseOverviewScreen: Root_PurchaseOverviewScreenParams;
  Root_PurchaseConfirmationScreen: Root_PurchaseConfirmationScreenParams;
  Root_PurchaseTariffZonesSearchByMapScreen: Root_PurchaseTariffZonesSearchByMapScreenParams;
  Root_PurchaseTariffZonesSearchByTextScreen: Root_PurchaseTariffZonesSearchByTextScreenParams;
  Root_PurchaseAsAnonymousConsequencesScreen: undefined;
  Root_PurchasePaymentWithCreditCardScreen: PaymentParams & {
    paymentMethod: CardPaymentMethod;
  };
  Root_PurchasePaymentWithVippsScreen: PaymentParams;
  Root_MobileTokenOnboardingStack: undefined;
  Root_MobileTokenWithoutTravelcardOnboardingStack: undefined;
  Root_FareContractDetailsScreen: FareContractDetailsRouteParams;
  Root_CarnetDetailsScreen: CarnetDetailsRouteParams;
  Root_ReceiptScreen: ReceiptScreenRouteParams;
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
