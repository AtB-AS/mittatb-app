import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {Location, SearchLocation, StoredLocationFavorite} from '@atb/favorites';
import {Root_LocationSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {FareProductTypeConfig} from '@atb/configuration';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {Root_PurchaseTariffZonesSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByTextScreen/navigation-types';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {ReserveOffer} from '@atb/ticketing';
import {PreassignedFareProduct} from '@atb/configuration';
import {CardPaymentMethod} from '@atb/stacks-hierarchy/types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {ParkingViolationType} from '@atb/api/types/mobility';

export type NextScreenParams<T extends keyof RootStackParamList> = {
  screen: T;
  /*
   Can use 'as any' when using these params when navigating, as type safety is
   ensured at creation time.
   */
  params: RootStackParamList[T];
};

export type Root_AddEditFavoritePlaceScreenParams = {
  editItem?: StoredLocationFavorite;
  searchLocation?: SearchLocation;
};

export type Root_PurchaseTariffZonesSearchByMapScreenParams = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
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

type AfterLoginScreenType =
  | NextScreenParams<'Root_TabNavigatorStack'>
  | NextScreenParams<'Root_PurchaseOverviewScreen'>
  | NextScreenParams<'Root_PurchaseConfirmationScreen'>
  | NextScreenParams<'Root_ActiveTokenOnPhoneRequiredForFareProductScreen'>;

export type Root_LoginActiveFareContractWarningScreenParams = {
  afterLogin?: AfterLoginScreenType;
};

export type Root_LoginOptionsScreenParams = {
  afterLogin?: AfterLoginScreenType;
};

export type Root_LoginPhoneInputScreenParams = {
  afterLogin?: AfterLoginScreenType;
};

export type Root_LoginConfirmCodeScreenParams = {
  phoneNumber: string;
  afterLogin?: AfterLoginScreenType;
};

export type Root_LoginRequiredForFareProductScreenParams = {
  afterLogin?: AfterLoginScreenType;
  fareProductTypeConfig: FareProductTypeConfig;
};

export type Root_ActiveTokenOnPhoneRequiredForFareProductScreenParams = {
  nextScreen?:
    | NextScreenParams<'Root_TabNavigatorStack'>
    | NextScreenParams<'Root_PurchaseOverviewScreen'>;
};

type Root_ParkingViolationsPhotoParams = {
  selectedViolations: ParkingViolationType[];
};

type Root_ParkingViolationsQrParams = Root_ParkingViolationsPhotoParams & {
  photo: string;
};

type Root_ParkingViolationsConfirmationParams = {
  providerName: string | undefined;
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
  Root_ShareTravelHabitsScreen: undefined;
  Root_PurchaseOverviewScreen: Root_PurchaseOverviewScreenParams;
  Root_PurchaseConfirmationScreen: Root_PurchaseConfirmationScreenParams;
  Root_PurchaseTariffZonesSearchByMapScreen: Root_PurchaseTariffZonesSearchByMapScreenParams;
  Root_PurchaseTariffZonesSearchByTextScreen: Root_PurchaseTariffZonesSearchByTextScreenParams;
  Root_PurchaseHarborSearchScreen: Root_PurchaseHarborSearchScreenParams;
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

  Root_LoginActiveFareContractWarningScreen: Root_LoginActiveFareContractWarningScreenParams;
  Root_LoginOptionsScreen: Root_LoginOptionsScreenParams;
  Root_LoginConfirmCodeScreen: Root_LoginConfirmCodeScreenParams;
  Root_LoginPhoneInputScreen: Root_LoginPhoneInputScreenParams;
  Root_LoginRequiredForFareProductScreen: Root_LoginRequiredForFareProductScreenParams;
  Root_ActiveTokenOnPhoneRequiredForFareProductScreen: Root_ActiveTokenOnPhoneRequiredForFareProductScreenParams;
  Root_AddPaymentMethodScreen: undefined;

  Root_ParkingViolationsSelect: undefined;
  Root_ParkingViolationsPhoto: Root_ParkingViolationsPhotoParams;
  Root_ParkingViolationsQr: Root_ParkingViolationsQrParams;
  Root_ParkingViolationsConfirmation: Root_ParkingViolationsConfirmationParams;
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
