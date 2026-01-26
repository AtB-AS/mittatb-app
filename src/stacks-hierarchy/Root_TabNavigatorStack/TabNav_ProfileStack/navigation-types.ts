import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {PlaceScreenParams} from '@atb/screen-components/place-screen';
import {NearbyStopPlacesScreenParams} from '@atb/screen-components/nearby-stop-places';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {SmartParkAndRideScreenParams} from './Profile_SmartParkAndRideScreen';

export type ProfileStackParams = StackParams<{
  Profile_RootScreen: undefined;
  Profile_PaymentMethodsScreen: undefined;
  Profile_PurchaseHistoryScreen: undefined;
  Profile_BonusScreen: undefined;
  Profile_SmartParkAndRideScreen: SmartParkAndRideScreenParams;
  Profile_DeleteProfileScreen: undefined;
  Profile_EditProfileScreen: undefined;
  Profile_FavoriteListScreen: undefined;
  Profile_SortFavoritesScreen: undefined;
  Profile_FavoriteDeparturesScreen: undefined;
  Profile_SelectStartScreenScreen: undefined;
  Profile_TravelTokenScreen: undefined;
  Profile_AppearanceScreen: undefined;
  Profile_LanguageScreen: undefined;
  Profile_PrivacyScreen: undefined;
  Profile_NotificationsScreen: undefined;
  Profile_DefaultUserProfileScreen: undefined;
  Profile_EnrollmentScreen: undefined;
  Profile_DesignSystemScreen: undefined;
  Profile_FareContractsScreen: undefined;
  Profile_DebugInfoScreen: undefined;
  Profile_NearbyStopPlacesScreen: NearbyStopPlacesScreenParams;
  Profile_PlaceScreen: PlaceScreenParams;
  Profile_TravelAidScreen: undefined;
  Profile_TravelAidInformationScreen: undefined;
  Profile_SettingsScreen: undefined;
  Profile_FavoriteScreen: undefined;
  Profile_InformationScreen: undefined;
  Profile_HelpAndContactScreen: undefined;
}>;

export type ProfileStackRootProps =
  TabNavigatorScreenProps<'TabNav_ProfileStack'>;

export type ProfileScreenProps<T extends keyof ProfileStackParams> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParams, T>,
    ProfileStackRootProps
  >;
