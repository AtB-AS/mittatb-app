import {Location} from '@atb/favorites/types';
import {RouteParams as LocationSearchParams} from '@atb/location-search';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {NearbyStackParams} from '@atb/screens/Nearby/types';
import {AddEditFavoriteRootParams} from '@atb/screens/Profile/AddEditFavorite';
import {ProfileStackParams} from '@atb/screens/Profile/types';
import {TicketingStackParams} from '@atb/screens/Ticketing/Purchase/types';
import {TicketModalStackParams} from '@atb/screens/Ticketing/Ticket/Details/types';
import {TicketTabsNavigatorParams} from '@atb/screens/Ticketing/Tickets/types';
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

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: NavigatorScreenParams<TabNavigatorParams>;
  LocationSearch: LocationSearchParams;
  SortableFavoriteList: undefined;
  AddEditFavorite: NavigatorScreenParams<AddEditFavoriteRootParams>;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
  TicketPurchase: NavigatorScreenParams<TicketingStackParams>;
  TicketModal: NavigatorScreenParams<TicketModalStackParams>;
  MobileTokenOnboarding: undefined;
  SelectTravelTokenRoot: undefined;
  ConsequencesFromTicketPurchase: undefined;
};

export type RootProps = NavigationProp<RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type TabNavigatorParams = {
  Assistant: {
    fromLocation: Location;
    toLocation: Location;
  };
  Nearest: NavigatorScreenParams<NearbyStackParams>;
  Ticketing: NavigatorScreenParams<TicketTabsNavigatorParams>;
  Profile: NavigatorScreenParams<ProfileStackParams>;
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
