import {
  TabNavigatorNavigationProps,
  TabNavigatorScreenProps,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import { NearbyStopPlacesScreenParams } from "@atb/nearby-stop-places/NearbyStopPlacesScreenComponent";

export type ProfileStackParams = {
  ProfileHome: undefined;
  PaymentOptions: undefined;
  TicketHistory: undefined;
  DeleteProfile: undefined;
  FavoriteList: undefined;
  Profile_FavoriteDeparturesScreen: undefined;
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
  Profile_NearbyStopPlacesScreen: NearbyStopPlacesScreenParams;
  Profile_PlaceScreen: PlaceScreenParams;
};

export type ProfileStackRootProps =
  TabNavigatorScreenProps<'TabNav_ProfileStack'>;

export type ProfileStackRootNavigationProps =
  TabNavigatorNavigationProps<'TabNav_TicketingStack'>;

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
