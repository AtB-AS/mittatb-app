import {
  TabNavigatorNavigationProps,
  TabNavigatorScreenProps,
} from '@atb/navigation/types';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {NearbyDeparturesScreenParams} from "@atb/screens/Dashboard/NearbyDeparturesScreen";
import {NearbyLinesScreenParams} from "@atb/screens/Dashboard/NearbyLinesScreen";

export type ProfileStackParams = {
  ProfileHome: undefined;
  PaymentOptions: undefined;
  TicketHistory: undefined;
  DeleteProfile: undefined;
  FavoriteList: undefined;
  FavoriteDepartures: undefined;
  SelectStartScreen: undefined;
  TravelToken: undefined;
  SelectTravelToken: undefined;
  Appearance: undefined;
  Language: undefined;
  DefaultUserProfile: undefined;
  Enrollment: undefined;
  DesignSystem: undefined;
  DebugInfo: undefined;
  TicketingInformation: undefined;
  PaymentInformation: undefined;
  TermsInformation: undefined;
  TicketInspectionInformation: undefined;
  NearbyDeparturesScreen: NearbyDeparturesScreenParams | undefined;
  NearbyLinesScreen: NearbyLinesScreenParams
};

export type ProfileStackRootProps = TabNavigatorScreenProps<'Profile'>;

export type ProfileStackRootNavigationProps =
  TabNavigatorNavigationProps<'Ticketing'>;

export type ProfileNavigationProps<T extends keyof ProfileStackParams> =
  CompositeNavigationProp<
    NavigationProp<ProfileStackParams, T>,
    ProfileStackRootNavigationProps
  >;

export type ProfileScreenProps<T extends keyof ProfileStackParams> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParams, T>,
    ProfileStackRootProps
  >;
