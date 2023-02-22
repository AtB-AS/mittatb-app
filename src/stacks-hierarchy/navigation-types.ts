import {LoginInAppStackParams} from '@atb/login/types';
import {FareContractModalStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Details/types';
import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {
  Location,
  SearchLocation,
  StoredLocationFavorite,
} from '@atb/favorites/types';
import {Root_LocationSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
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

export type RootStackParamList = {
  NotFound: undefined;
  Root_OnboardingStack: undefined;
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
  FareContractModal: NavigatorScreenParams<FareContractModalStackParams>;
  Root_MobileTokenOnboardingStack: undefined;
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
