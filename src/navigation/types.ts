import {Location} from '@atb/favorites/types';
import {RouteParams as LocationSearchParams} from '@atb/location-search/LocationSearch';
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
  ParamListBase,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: NavigatorScreenParams<TabNavigatorParams>;
  LocationSearch: LocationSearchParams;
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

interface ISubNavigator<T extends ParamListBase, K extends keyof T> {
  screen: K;
  params?: T[K];
}

export type TabNavigatorParams = {
  Assistant: {
    fromLocation?: Location;
    toLocation?: Location;
  };
  Nearest: NavigatorScreenParams<NearbyStackParams>;
  Ticketing:
    | ISubNavigator<
        TicketingTabsNavigatorParams,
        'ActiveFareProductsAndReservationsTab'
      >
    | ISubNavigator<TicketingTabsNavigatorParams, 'PurchaseTab'>;
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
