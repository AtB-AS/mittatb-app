import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {NearbyStopPlacesScreenParams} from '@atb/nearby-stop-places/NearbyStopPlacesScreenComponent';
import {ScreenParams} from "@atb/stacks-hierarchy/navigation-types";

export type ProfileStackParams = {
  Profile_RootScreen: ScreenParams<undefined>;
  Profile_PaymentOptionsScreen: ScreenParams<undefined>;
  Profile_TicketHistoryScreen: ScreenParams<undefined>;
  Profile_DeleteProfileScreen: ScreenParams<undefined>;
  Profile_EditProfileScreen: ScreenParams<undefined>;
  Profile_FavoriteListScreen: ScreenParams<undefined>;
  Profile_SortFavoritesScreen: ScreenParams<undefined>;
  Profile_FavoriteDeparturesScreen: ScreenParams<undefined>;
  Profile_SelectStartScreenScreen: ScreenParams<undefined>;
  Profile_TravelTokenScreen: ScreenParams<undefined>;
  Profile_SelectTravelTokenScreen: ScreenParams<undefined>;
  Profile_AppearanceScreen: ScreenParams<undefined>;
  Profile_LanguageScreen: ScreenParams<undefined>;
  Profile_PrivacyScreen: ScreenParams<undefined>;
  Profile_NotificationsScreen: ScreenParams<undefined>;
  Profile_DefaultUserProfileScreen: ScreenParams<undefined>;
  Profile_EnrollmentScreen: ScreenParams<undefined>;
  Profile_DesignSystemScreen: ScreenParams<undefined>;
  Profile_FareContractsScreen: ScreenParams<undefined>;
  Profile_DebugInfoScreen: ScreenParams<undefined>;
  Profile_TicketingInformationScreen: ScreenParams<undefined>;
  Profile_TermsInformationScreen: ScreenParams<undefined>;
  Profile_TicketInspectionInformationScreen: ScreenParams<undefined>;
  Profile_GenericWebsiteInformationScreen: ScreenParams<undefined>;
  Profile_NearbyStopPlacesScreen: ScreenParams<NearbyStopPlacesScreenParams>;
  Profile_PlaceScreen: ScreenParams<PlaceScreenParams>;
};

export type ProfileStackRootProps =
  TabNavigatorScreenProps<'TabNav_ProfileStack'>;

export type ProfileScreenProps<T extends keyof ProfileStackParams> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<ProfileStackParams, T>,
      ProfileStackRootProps
    >,
    StackScreenProps<RootStackParamList>
  >;
