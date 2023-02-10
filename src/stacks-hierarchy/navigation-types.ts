import {LocationSearchStackParams} from '@atb/location-search';
import {LoginInAppStackParams} from '@atb/login/types';
import {PurchaseStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Purchase/types';
import {FareContractModalStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Details/types';
import {NavigationProp, NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {SearchLocation, StoredLocationFavorite} from '@atb/favorites/types';

export type Root_AddEditFavoritePlaceScreenParams = {
  editItem?: StoredLocationFavorite;
  searchLocation?: SearchLocation;
};

export type RootStackParamList = {
  NotFound: undefined;
  Root_OnboardingStack: undefined;
  Root_TabNavigatorStack: NavigatorScreenParams<TabNavigatorStackParams>;
  LocationSearchStack: NavigatorScreenParams<LocationSearchStackParams>;
  Root_AddEditFavoritePlaceScreen: Root_AddEditFavoritePlaceScreenParams;
  Root_SearchStopPlaceScreen: undefined;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
  Purchase: NavigatorScreenParams<PurchaseStackParams>;
  FareContractModal: NavigatorScreenParams<FareContractModalStackParams>;
  Root_MobileTokenOnboardingStack: undefined;
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
