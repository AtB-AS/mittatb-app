import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {Location, SearchLocation, StoredLocationFavorite} from '@atb/favorites';
import {Root_LocationSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {Root_PurchaseTariffZonesSearchByTextScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByTextScreen/navigation-types';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {ParkingViolationType} from '@atb/api/types/mobility';
import {Root_ChooseTicketRecipientScreenParams} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/navigation-types';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export type Root_AddEditFavoritePlaceScreenParams = {
  editItem?: StoredLocationFavorite;
  searchLocation?: SearchLocation;
};

export type Root_PurchaseTariffZonesSearchByMapScreenParams = {
  selection: PurchaseSelectionType;
};

export type Root_LocationSearchByMapScreenParams = {
  callerRouteName: string;
  callerRouteParam: string;
  initialLocation?: Location;
};

type ReceiptScreenRouteParams = {
  orderId: string;
  orderVersion: string;
};

type FareContractDetailsRouteParams = {
  fareContractId: string;
};

type TicketInformationScreenParams = {
  fareProductTypeConfigType: string;
  preassignedFareProductId: string | undefined;
};

export type Root_LoginOptionsScreenParams = {
  showGoBack?: boolean;
};

export type Root_LoginConfirmCodeScreenParams = {
  phoneNumber: string;
};

export type Root_LoginRequiredForFareProductScreenParams = {
  selection: PurchaseSelectionType;
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

type Root_ScooterHelpScreenParams = {
  operatorId: string;
  vehicleId: string | null;
};

type Root_ContactScooterOperatorScreenParams = {
  vehicleId: string | null;
  operatorId: string;
};

type Root_ContactScooterOperatorConfirmationScreenParams = {
  operatorName: string;
};

type Root_PurchaseAsAnonymousConsequencesScreenParams = {
  showLoginButton: boolean | undefined;
};

type Root_ConfirmationScreenParams = {
  message: string;
  // Time that must be wait until onComplete is called (in milliseconds)
  delayBeforeCompleted?: number;
  nextScreen: NextScreenParams<'Root_TabNavigatorStack'>;
};

export type NextScreenParams<
  T extends keyof RootStackParamList = keyof RootStackParamList,
> = {
  [S in T]: {
    screen: S;
    params: RootStackParamList[S];
  };
}[T];

export type RootStackParamList = StackParams<{
  Root_ExtendedOnboardingStack: undefined;
  Root_ConsiderTravelTokenChangeScreen: undefined;
  Root_SelectTravelTokenScreen: undefined;
  Root_TabNavigatorStack: NavigatorScreenParams<TabNavigatorStackParams>;
  Root_LocationSearchByTextScreen: Root_LocationSearchByTextScreenParams;
  Root_LocationSearchByMapScreen: Root_LocationSearchByMapScreenParams;
  Root_ScanQrCodeScreen: undefined;
  Root_AddEditFavoritePlaceScreen: Root_AddEditFavoritePlaceScreenParams;
  Root_SearchFavoritePlaceScreen: undefined;
  Root_ShareTravelHabitsScreen: undefined;
  Root_PurchaseOverviewScreen: Root_PurchaseOverviewScreenParams;
  Root_PurchaseConfirmationScreen: Root_PurchaseConfirmationScreenParams;
  Root_PurchaseTariffZonesSearchByMapScreen: Root_PurchaseTariffZonesSearchByMapScreenParams;
  Root_PurchaseTariffZonesSearchByTextScreen: Root_PurchaseTariffZonesSearchByTextScreenParams;
  Root_PurchaseHarborSearchScreen: Root_PurchaseHarborSearchScreenParams;
  Root_PurchaseAsAnonymousConsequencesScreen: Root_PurchaseAsAnonymousConsequencesScreenParams;
  Root_FareContractDetailsScreen: FareContractDetailsRouteParams;
  Root_ReceiptScreen: ReceiptScreenRouteParams;
  Root_TicketInformationScreen: TicketInformationScreenParams;
  Root_LoginAvailableFareContractWarningScreen: undefined;
  Root_LoginOptionsScreen: Root_LoginOptionsScreenParams;
  Root_LoginConfirmCodeScreen: Root_LoginConfirmCodeScreenParams;
  Root_LoginPhoneInputScreen: undefined;
  Root_LoginRequiredForFareProductScreen: Root_LoginRequiredForFareProductScreenParams;
  Root_ParkingViolationsSelectScreen: undefined;
  Root_ParkingViolationsPhotoScreen: Root_ParkingViolationsPhotoParams;
  Root_ParkingViolationsQrScreen: Root_ParkingViolationsQrParams;
  Root_ParkingViolationsConfirmationScreen: Root_ParkingViolationsConfirmationParams;
  Root_ScooterHelpScreen: Root_ScooterHelpScreenParams;
  Root_ShmoOnboardingScreen: undefined;
  Root_ContactScooterOperatorScreen: Root_ContactScooterOperatorScreenParams;
  Root_ContactScooterOperatorConfirmationScreen: Root_ContactScooterOperatorConfirmationScreenParams;
  Root_NotificationPermissionScreen: undefined;
  Root_LocationWhenInUsePermissionScreen: undefined;
  Root_ChooseTicketRecipientScreen: Root_ChooseTicketRecipientScreenParams;
  Root_ConfirmationScreen: Root_ConfirmationScreenParams;
}>;

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type CustomScreenParams = {
  /**
   * Parameter which can be used to override the transition specified in the
   * stack navigator.
   */
  transitionOverride?: 'slide-from-right' | 'slide-from-bottom';
};

/**
 * This type is meant to be used on every stack params specification. It both:
 * - Checks that each key in the stack param list ends with "Screen" or "Stack"
 * - Adds the CustomScreenParams to the mapped value type, which makes it
 *   possible to set transition when navigating.
 */
export type StackParams<
  T extends {
    [K in keyof T]: K extends string
      ? K extends `${string}Screen` | `${string}Stack`
        ? object | undefined
        : never
      : never;
  },
> = {
  [K in keyof T]: T[K] extends undefined
    ? CustomScreenParams | undefined
    : T[K] & CustomScreenParams;
};
