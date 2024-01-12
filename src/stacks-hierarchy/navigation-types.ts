import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps, TransitionPreset} from '@react-navigation/stack';
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {Location, SearchLocation, StoredLocationFavorite} from '@atb/favorites';
import {Root_LocationSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {
  FareProductTypeConfig,
  PreassignedFareProduct,
} from '@atb/configuration';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {Root_PurchaseTariffZonesSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByTextScreen/navigation-types';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {ReserveOffer} from '@atb/ticketing';
import {CardPaymentMethod} from '@atb/stacks-hierarchy/types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {ParkingViolationType} from '@atb/api/types/mobility';
import {Root_ChooseTicketReceiverScreenParams} from '@atb/stacks-hierarchy/Root_ChooseTicketReceiverScreen/navigation-types';
import {
  AfterLoginScreenType,
  NextScreenParams,
} from '@atb/utils/use-complete-onboarding-and-enter-app';

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
};

type ReceiptScreenRouteParams = {
  orderId: string;
  orderVersion: string;
};

type FareContractDetailsRouteParams = {
  orderId: string;
};

type TicketInformationScreenParams = {
  fareProductTypeConfigType: string;
  preassignedFareProductId: string | undefined;
};

export type Root_LoginActiveFareContractWarningScreenParams = {
  afterLogin?: AfterLoginScreenType;
};

export type Root_LoginOptionsScreenParams = {
  afterLogin?: AfterLoginScreenType;
  showGoBack?: boolean;
};

export type Root_LoginPhoneInputScreenParams = {
  afterLogin?: AfterLoginScreenType;
  transitionPreset?: TransitionPreset;
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

type Root_ParkingViolationsPhotoParams = ScreenParams<{
  selectedViolations: ParkingViolationType[];
}>;

type Root_ParkingViolationsQrParams = Root_ParkingViolationsPhotoParams & {
  photo: string;
};

type Root_ParkingViolationsConfirmationParams = {
  providerName: string | undefined;
};

type Root_PurchaseAsAnonymousConsequencesScreenParams = {
  showLoginButton: boolean | undefined;
  transitionPreset?: TransitionPreset;
};

type Root_PurchasePaymentWithCreditCardScreenParams = PaymentParams & {
  paymentMethod: CardPaymentMethod;
};

export type RootStackParamList = {
  NotFound: ScreenParams<undefined>;
  Root_OnboardingStack: ScreenParams<undefined>;
  Root_TermsInformationScreen: ScreenParams<undefined>;
  Root_ConsiderTravelTokenChangeScreen: ScreenParams<undefined>;
  Root_SelectTravelTokenScreen: ScreenParams<undefined>;
  Root_TicketAssistantStack: ScreenParams<undefined>;
  Root_TabNavigatorStack: ScreenParams<
    NavigatorScreenParams<TabNavigatorStackParams>
  >;
  Root_LocationSearchByTextScreen: ScreenParams<Root_LocationSearchByTextScreenParams>;
  Root_LocationSearchByMapScreen: ScreenParams<Root_LocationSearchByMapScreenParams>;
  Root_AddEditFavoritePlaceScreen: ScreenParams<Root_AddEditFavoritePlaceScreenParams>;
  Root_SearchStopPlaceScreen: ScreenParams<undefined>;
  Root_ShareTravelHabitsScreen: ScreenParams<undefined>;
  Root_PurchaseOverviewScreen: ScreenParams<Root_PurchaseOverviewScreenParams>;
  Root_PurchaseConfirmationScreen: ScreenParams<Root_PurchaseConfirmationScreenParams>;
  Root_PurchaseTariffZonesSearchByMapScreen: ScreenParams<Root_PurchaseTariffZonesSearchByMapScreenParams>;
  Root_PurchaseTariffZonesSearchByTextScreen: ScreenParams<Root_PurchaseTariffZonesSearchByTextScreenParams>;
  Root_PurchaseHarborSearchScreen: ScreenParams<Root_PurchaseHarborSearchScreenParams>;
  Root_PurchaseAsAnonymousConsequencesScreen: ScreenParams<Root_PurchaseAsAnonymousConsequencesScreenParams>;
  Root_PurchasePaymentWithCreditCardScreen: ScreenParams<Root_PurchasePaymentWithCreditCardScreenParams>;
  Root_PurchasePaymentWithVippsScreen: ScreenParams<PaymentParams>;
  Root_FareContractDetailsScreen: ScreenParams<FareContractDetailsRouteParams>;
  Root_CarnetDetailsScreen: ScreenParams<CarnetDetailsRouteParams>;
  Root_ReceiptScreen: ScreenParams<ReceiptScreenRouteParams>;
  Root_TicketInformationScreen: ScreenParams<TicketInformationScreenParams>;
  Root_LoginActiveFareContractWarningScreen: ScreenParams<Root_LoginActiveFareContractWarningScreenParams>;
  Root_LoginOptionsScreen: ScreenParams<Root_LoginOptionsScreenParams>;
  Root_LoginConfirmCodeScreen: ScreenParams<Root_LoginConfirmCodeScreenParams>;
  Root_LoginPhoneInputScreen: ScreenParams<Root_LoginPhoneInputScreenParams>;
  Root_LoginRequiredForFareProductScreen: ScreenParams<Root_LoginRequiredForFareProductScreenParams>;
  Root_ActiveTokenOnPhoneRequiredForFareProductScreen: ScreenParams<Root_ActiveTokenOnPhoneRequiredForFareProductScreenParams>;
  Root_AddPaymentMethodScreen: ScreenParams<undefined>;
  Root_ParkingViolationsSelect: ScreenParams<undefined>;
  Root_ParkingViolationsPhoto: ScreenParams<Root_ParkingViolationsPhotoParams>;
  Root_ParkingViolationsQr: ScreenParams<Root_ParkingViolationsQrParams>;
  Root_ParkingViolationsConfirmation: ScreenParams<Root_ParkingViolationsConfirmationParams>;
  Root_NotificationPermissionScreen: ScreenParams<undefined>;
  Root_LocationWhenInUsePermissionScreen: ScreenParams<undefined>;
  Root_ChooseTicketReceiverScreen: ScreenParams<Root_ChooseTicketReceiverScreenParams>;
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type CustomScreenParams = {
  transitionPreset?: TransitionPreset;
};

/**
 * This type is meant to be used on every screen params in a stack param list, and
 * it makes it possible to specify transition when navigating to another screen.
 */
export type ScreenParams<T extends Record<string, any> | undefined> = T &
  (CustomScreenParams | undefined);
