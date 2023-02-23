import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {NearbyStopPlacesScreenParams} from '@atb/nearby-stop-places/NearbyStopPlacesScreenComponent';

export type ProfileStackParams = {
  Profile_RootScreen: undefined;
  Profile_PaymentOptionsScreen: undefined;
  Profile_TicketHistoryScreen: undefined;
  Profile_DeleteProfileScreen: undefined;
  Profile_FavoriteListScreen: undefined;
  Profile_SortFavoritesScreen: undefined;
  Profile_FavoriteDeparturesScreen: undefined;
  Profile_SelectStartScreenScreen: undefined;
  Profile_TravelTokenScreen: undefined;
  Profile_SelectTravelTokenScreen: undefined;
  Profile_AppearanceScreen: undefined;
  Profile_LanguageScreen: undefined;
  Profile_DefaultUserProfileScreen: undefined;
  Profile_EnrollmentScreen: undefined;
  Profile_DesignSystemScreen: undefined;
  Profile_DebugInfoScreen: undefined;
  Profile_TicketingInformationScreen: undefined;
  Profile_TermsInformationScreen: undefined;
  Profile_TicketInspectionInformationScreen: undefined;
  Profile_GenericWebsiteInformationScreen: undefined;
  Profile_NearbyStopPlacesScreen: NearbyStopPlacesScreenParams;
  Profile_PlaceScreen: PlaceScreenParams;
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
