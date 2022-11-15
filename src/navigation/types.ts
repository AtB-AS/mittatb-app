import {LocationSearchStackParams} from '@atb/location-search';
import {LoginInAppStackParams} from '@atb/login/types';
import {NearbyStackParams} from '@atb/screens/Nearby/types';
import {AddEditFavoriteRootParams} from '@atb/screens/Profile/AddEditFavorite/types';
import {ProfileStackParams} from '@atb/screens/Profile/types';
import {PurchaseStackParams} from '@atb/screens/Ticketing/Purchase/types';
import {FareContractModalStackParams} from '@atb/screens/Ticketing/FareContracts/Details/types';
import {TicketingTabsNavigatorParams} from '@atb/screens/Ticketing/types';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DashboardParams} from '@atb/screens/Dashboard/types';

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: NavigatorScreenParams<TabNavigatorParams>;
  LocationSearchStack: NavigatorScreenParams<LocationSearchStackParams>;
  SortableFavoriteList: undefined;
  AddEditFavorite: NavigatorScreenParams<AddEditFavoriteRootParams>;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
  Purchase: NavigatorScreenParams<PurchaseStackParams>;
  FareContractModal: NavigatorScreenParams<FareContractModalStackParams>;
  MobileTokenOnboarding: undefined;
  SelectTravelTokenRoot: undefined;
  ConsequencesFromPurchase: undefined;
};

export type RootNavigationProps = NavigationProp<RootStackParamList>;
export type RootStackProps = RootStackScreenProps<keyof RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type TabNavigatorParams = {
  Dashboard: NavigatorScreenParams<DashboardParams>;
  Nearest: NavigatorScreenParams<NearbyStackParams>;
  Ticketing: NavigatorScreenParams<TicketingTabsNavigatorParams>;
  Profile: NavigatorScreenParams<ProfileStackParams>;
  MapScreen: undefined;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorParams> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParams, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type TabNavigatorNavigationProps<T extends keyof TabNavigatorParams> =
  CompositeNavigationProp<
    BottomTabNavigationProp<TabNavigatorParams, T>,
    NavigationProp<RootStackParamList>
  >;
